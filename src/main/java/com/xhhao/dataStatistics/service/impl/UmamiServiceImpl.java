package com.xhhao.dataStatistics.service.impl;

import com.xhhao.dataStatistics.service.SettingConfigGetter;
import com.xhhao.dataStatistics.service.UmamiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;

import cn.hutool.crypto.SecureUtil;
import cn.hutool.crypto.digest.DigestUtil;
import cn.hutool.crypto.symmetric.AES;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Umami 服务实现：负责登录 Umami 并在内存中缓存加密后的 token。
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UmamiServiceImpl implements UmamiService {

    private final SettingConfigGetter settingConfigGetter;
    private final WebClient.Builder webClientBuilder;

    /** 使用加密字符串缓存 token，避免明文常驻内存 */
    private final AtomicReference<String> encryptedTokenCache = new AtomicReference<>();

    @Override
    public Mono<String> getToken() {
        return settingConfigGetter.getUmamiConfig()
            .flatMap(config -> {
                if (!StringUtils.hasText(config.getSiteUrl())
                    || !StringUtils.hasText(config.getUserName())
                    || !StringUtils.hasText(config.getUserPassWord())) {
                    return Mono.error(new IllegalStateException("Umami 配置不完整，无法获取 token"));
                }

                String encrypted = encryptedTokenCache.get();
                if (encrypted != null) {
                    try {
                        return Mono.just(decrypt(encrypted, config.getUserPassWord()));
                    } catch (Exception ex) {
                        log.warn("Umami token 解密失败，将重新请求: {}", ex.getMessage());
                        encryptedTokenCache.set(null);
                    }
                }
                return requestToken(config)
                    .map(response -> cacheAndReturn(response.token(), config.getUserPassWord()));
            });
    }

    private Mono<LoginResponse> requestToken(SettingConfigGetter.UmamiConfig config) {
        String baseUrl = normalizeBaseUrl(config.getSiteUrl());
        if (baseUrl.isEmpty()) {
            return Mono.error(new IllegalStateException("Umami 站点地址为空"));
        }
        WebClient client = webClientBuilder.baseUrl(baseUrl).build();
        LoginRequest request = new LoginRequest(config.getUserName(), config.getUserPassWord());

        return client.post()
            .uri("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(LoginResponse.class)
            .onErrorResume(ex -> {
                log.error("请求 Umami token 失败: {}", ex.getMessage());
                return Mono.error(new IllegalStateException("请求 Umami token 失败", ex));
            });
    }

    private String cacheAndReturn(String token, String password) {
        String encrypted = encrypt(token, password);
        encryptedTokenCache.set(encrypted);
        return token;
    }

    private String encrypt(String content, String password) {
        return aes(password).encryptBase64(content, StandardCharsets.UTF_8);
    }

    private String decrypt(String encryptedContent, String password) {
        return aes(password).decryptStr(encryptedContent, StandardCharsets.UTF_8);
    }

    private AES aes(String password) {
        String seed = (password != null) ? password : "umami-default-pass";
        byte[] key = DigestUtil.sha256(seed);
        return SecureUtil.aes(key);
    }

    private String normalizeBaseUrl(String siteUrl) {
        String trimmed = (siteUrl != null) ? siteUrl.trim() : "";
        if (trimmed.endsWith("/")) {
            return trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }

    private record LoginRequest(String username, String password) {
    }

    private record LoginResponse(String token, User user) {
    }

    private record User(String id, String username, String role, String createdAt, boolean isAdmin) {
    }
}

