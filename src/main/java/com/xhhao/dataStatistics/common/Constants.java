package com.xhhao.dataStatistics.common;

import java.time.ZoneId;

/**
 * 通用常量类
 *
 * @author Handsome
 * @since 1.0.5
 */
public final class Constants {

    private Constants() {
        // 禁止实例化
    }

    /**
     * 默认时区：亚洲/上海
     */
    public static final String DEFAULT_TIMEZONE = "Asia/Shanghai";
    public static final ZoneId DEFAULT_ZONE_ID = ZoneId.of(DEFAULT_TIMEZONE);

    /**
     * 缓存相关常量
     */
    public static final class Cache {
        private Cache() {}
        
        /** 图表数据缓存时间（分钟） */
        public static final int CHART_DATA_CACHE_MINUTES = 5;
        
        /** Umami Token 缓存时间（小时） */
        public static final int UMAMI_TOKEN_CACHE_HOURS = 24;
    }

    /**
     * 默认 URL 常量
     */
    public static final class DefaultUrls {
        private DefaultUrls() {}
        
        public static final String GITHUB_STATS_URL = "https://github-readme-stats.vercel.app/";
        public static final String GITHUB_GRAPH_URL = "https://github-readme-activity-graph.vercel.app/";
    }
}
