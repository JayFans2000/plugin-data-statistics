package com.xhhao.dataStatistics.config;

import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.channel.ChannelOption;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

/**
 * WebClient 配置类
 * 提供 WebClient.Builder 和 WebClient Bean 供其他组件使用
 *
 * @author Handsome
 * @since 1.0.5
 */
@Configuration
public class WebClientConfig {

    /**
     * 配置连接池，设置空闲超时时间避免复用已关闭的连接
     */
    @Bean
    public ConnectionProvider connectionProvider() {
        return ConnectionProvider.builder("data-statistics")
            .maxConnections(50)
            .maxIdleTime(Duration.ofSeconds(20))       // 空闲连接最大存活时间
            .maxLifeTime(Duration.ofSeconds(60))       // 连接最大生命周期
            .pendingAcquireTimeout(Duration.ofSeconds(30))
            .evictInBackground(Duration.ofSeconds(30)) // 后台定期清理过期连接
            .build();
    }

    /**
     * 配置 HttpClient
     */
    @Bean
    public HttpClient httpClient(ConnectionProvider connectionProvider) {
        return HttpClient.create(connectionProvider)
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)  // 连接超时 10 秒
            .responseTimeout(Duration.ofSeconds(30));              // 响应超时 30 秒
    }

    /**
     * 提供 WebClient.Builder（用于需要自定义 baseUrl 的场景）
     */
    @Bean
    public WebClient.Builder webClientBuilder(HttpClient httpClient) {
        return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(httpClient));
    }

    /**
     * 提供预配置的 WebClient 实例（用于不需要自定义 baseUrl 的场景）
     */
    @Bean
    public WebClient webClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder.build();
    }
}

