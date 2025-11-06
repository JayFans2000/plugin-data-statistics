package com.xhhao.dataStatistics.endpoint;

import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;

import com.xhhao.dataStatistics.service.StatisticalService;
import com.xhhao.dataStatistics.vo.PieChartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataStatisticsEndpoint implements CustomEndpoint {

    private final String tag = "api.data.statistics.xhhao.com/v1alpha1/statistics";
    private final StatisticalService statisticalService;

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
            .build();
    }

    private Mono<ServerResponse> fetchChartData(ServerRequest request) {
        return statisticalService.getPieChartVO()
            .flatMap(dataSource -> ServerResponse.ok().bodyValue(dataSource))
            .switchIfEmpty(ServerResponse.ok().bodyValue(new PieChartVO()))
            .onErrorResume(e -> {
                log.error("Failed to fetch chart data", e);
                return ServerResponse.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue("获取图表数据失败: " + e.getMessage());
            });
    }

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion("api.data.statistics.xhhao.com/v1alpha1");
    }
}

