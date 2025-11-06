package com.xhhao.dataStatistics.service;

import lombok.Data;
import reactor.core.publisher.Mono;

public interface SettingConfigGetter {
    Mono<BasicsConfig> getBasicsConfig();

    @Data
    class BasicsConfig {
        public static final String GROUP = "basics";

        private String title;
    }
}
