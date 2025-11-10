package com.xhhao.dataStatistics.service;

import reactor.core.publisher.Mono;

/**
 * 与 Umami 服务交互的业务接口。
 */
public interface UmamiService {

    /**
     * 获取 Umami 登录 token。Umami token 官方说明长期有效，因此默认会在内存中缓存。
     *
     * @return 可用于请求 Umami API 的 token
     */
    Mono<String> getToken();
}

