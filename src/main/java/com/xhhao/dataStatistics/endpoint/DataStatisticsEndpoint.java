package com.xhhao.dataStatistics.endpoint;

import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;
import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static org.springdoc.core.fn.builders.schema.Builder.schemaBuilder;

import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.xhhao.dataStatistics.common.ApiResponse;
import com.xhhao.dataStatistics.common.Constants;
import com.xhhao.dataStatistics.service.SettingConfigGetter;
import com.xhhao.dataStatistics.service.StatisticalService;
import com.xhhao.dataStatistics.service.UmamiService;
import com.xhhao.dataStatistics.service.UptimeKumaService;
import com.xhhao.dataStatistics.vo.PieChartVO;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataStatisticsEndpoint implements CustomEndpoint {

    private final String tag = "api.data.statistics.xhhao.com/v1alpha1/statistics";
    private final StatisticalService statisticalService;
    private final UmamiService umamiService;
    private final UptimeKumaService uptimeKumaService;
    private final SettingConfigGetter settingConfigGetter;

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        return SpringdocRouteBuilder.route()
            .GET("/chart/data", this::fetchChartData, builder -> {
                builder.operationId("fetchChartData")
                    .description("获取图表数据源")
                    .tag(tag)
                    .response(responseBuilder()
                        .implementation(PieChartVO.class)
                        .responseCode("200")
                        .description("成功返回图表数据")
                    );
            })
            .GET("/umami/websites", this::fetchUmamiWebsites, builder -> {
                builder.operationId("fetchUmamiWebsites")
                    .description("获取Umami网站列表")
                    .tag(tag)
                    .response(responseBuilder()
                        .responseCode("200")
                        .description("成功返回网站列表（原始JSON）")
                    );
            })
            .GET("/umami/visits", this::fetchVisits, builder -> {
                builder.operationId("fetchVisits")
                    .description("获取访问统计（支持日、周、月、季、年）")
                    .tag(tag)
                    .parameter(parameterBuilder()
                        .name("type")
                        .description("统计类型，可选值：daily(日统计，默认1天=24小时), weekly(周统计，默认1周=7天), monthly(月统计，默认1月=30天), quarterly(季统计，默认1季=3个月=90天), yearly(年统计，默认1年=365天)")
                        .required(true)
                        .schema(schemaBuilder()
                            .type("string")
                            .example("daily")
                        )
                    )
                    .response(responseBuilder()
                        .responseCode("200")
                        .description("成功返回访问统计数据")
                    );
            })
            .GET("/umami/realtime", this::fetchRealtimeVisits, builder -> {
                builder.operationId("fetchRealtimeVisits")
                    .description("获取实时访问统计")
                    .tag(tag)
                    .response(responseBuilder()
                        .responseCode("200")
                        .description("成功返回实时访问数据")
                    );
            })
            .GET("/uptime/status", this::fetchUptimeKumaStatus, builder -> {
                builder.operationId("fetchUptimeKumaStatus")
                    .description("获取 Uptime Kuma 状态页面数据")
                    .tag(tag)
                    .response(responseBuilder()
                        .responseCode("200")
                        .description("成功返回状态码：1-所有业务正常，0-全部业务异常，2-部分业务异常")
                    );
            })
            .GET("/github/config", this::fetchGithubConfig, builder -> {
                builder.operationId("fetchGithubConfig")
                    .description("获取 GitHub 配置信息")
                    .tag(tag)
                    .response(responseBuilder()
                        .responseCode("200")
                        .description("成功返回 GitHub 配置（proxyUrl 和 username）")
                    );
            })
            .build();
    }

    /**
     * 统一错误响应处理
     */
    private Mono<ServerResponse> handleError(String operation, Throwable e) {
        log.error("{}失败", operation, e);
        return ServerResponse.status(500)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(ApiResponse.error(operation + "失败", e.getMessage()));
    }

    private Mono<ServerResponse> fetchChartData(ServerRequest request) {
        return statisticalService.getPieChartVO()
            .flatMap(dataSource -> ServerResponse.ok().bodyValue(dataSource))
            .switchIfEmpty(ServerResponse.ok().bodyValue(new PieChartVO()))
            .onErrorResume(e -> handleError("获取图表数据", e));
    }

    private Mono<ServerResponse> fetchUmamiWebsites(ServerRequest request) {
        return umamiService.getWebsites()
            .flatMap(data -> ServerResponse.ok().bodyValue(data))
            .onErrorResume(e -> handleError("获取 Umami 网站列表", e));
    }

    private Mono<ServerResponse> fetchVisits(ServerRequest request) {
        String typeParam = request.queryParam("type").orElse("daily");
        
        if (!typeParam.matches("daily|weekly|monthly|quarterly|yearly")) {
            return ServerResponse.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error("参数错误", "type 参数错误，支持的值: daily, weekly, monthly, quarterly, yearly"));
        }
        
        return umamiService.getVisitStatistics(null, typeParam)
            .flatMap(data -> ServerResponse.ok().bodyValue(data))
            .onErrorResume(e -> handleError("获取" + typeParam + "访问统计", e));
    }

    private Mono<ServerResponse> fetchRealtimeVisits(ServerRequest request) {
        String websiteIdParam = request.queryParam("websiteId").orElse("");
        String finalWebsiteId = StrUtil.isBlank(websiteIdParam) ? null : websiteIdParam;
        
        return umamiService.getRealtimeVisitStatistics(finalWebsiteId)
            .flatMap(data -> ServerResponse.ok().bodyValue(data))
            .onErrorResume(e -> handleError("获取实时访问统计", e));
    }

    private Mono<ServerResponse> fetchUptimeKumaStatus(ServerRequest request) {
        return uptimeKumaService.getStatusPage()
            .flatMap(data -> ServerResponse.ok().bodyValue(data))
            .onErrorResume(e -> handleError("获取 Uptime Kuma 状态页面", e));
    }

    private Mono<ServerResponse> fetchGithubConfig(ServerRequest request) {
        return settingConfigGetter.getGithubConfig()
            .map(config -> {
                String proxyUrl = StrUtil.isNotBlank(config.getProxyUrl()) 
                    ? normalizeUrl(config.getProxyUrl(), Constants.DefaultUrls.GITHUB_STATS_URL)
                    : Constants.DefaultUrls.GITHUB_STATS_URL;
                String graphProxyUrl = StrUtil.isNotBlank(config.getGraphProxyUrl())
                    ? normalizeUrl(config.getGraphProxyUrl(), Constants.DefaultUrls.GITHUB_GRAPH_URL)
                    : Constants.DefaultUrls.GITHUB_GRAPH_URL;
                return new GithubConfigResponse(proxyUrl, config.getUsername(), graphProxyUrl);
            })
            .flatMap(config -> ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(config))
            .onErrorResume(e -> handleError("获取 GitHub 配置", e));
    }

    private String normalizeUrl(String url, String defaultUrl) {
        if (StrUtil.isBlank(url)) {
            return defaultUrl;
        }
        String normalized = url.trim();
        if (!normalized.endsWith("/")) {
            normalized += "/";
        }
        return normalized;
    }

    private record GithubConfigResponse(String proxyUrl, String username, String graphProxyUrl) {}

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion("api.data.statistics.xhhao.com/v1alpha1");
    }
}

