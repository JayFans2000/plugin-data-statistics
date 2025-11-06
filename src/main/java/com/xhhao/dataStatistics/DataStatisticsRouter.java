package com.xhhao.dataStatistics;

import com.xhhao.dataStatistics.service.SettingConfigGetter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.app.theme.TemplateNameResolver;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataStatisticsRouter {

    private final TemplateNameResolver templateNameResolver;
    private final SettingConfigGetter settingConfigGetter;

    @Bean
    RouterFunction<ServerResponse> dataStatisticsRoutes() {
        return RouterFunctions.route()
            .GET("/echart", this::echartHandler)
            .build();
    }

    private Mono<ServerResponse> echartHandler(ServerRequest request) {
        return settingConfigGetter.getBasicsConfig()
            .map(config -> {
                Map<String, Object> model = new HashMap<>();
                model.put("title", config.getTitle() != null ? config.getTitle() : "数据统计");
                return model;
            })
            .flatMap(model -> templateNameResolver.resolveTemplateNameOrDefault(request.exchange(), "echart")
                .flatMap(templateName -> ServerResponse.ok().render(templateName, model)))
            .onErrorResume(e -> {
                log.error("渲染 echart 页面失败", e);
                Map<String, Object> defaultModel = new HashMap<>();
                defaultModel.put("title", "数据统计");
                return templateNameResolver.resolveTemplateNameOrDefault(request.exchange(), "echart")
                    .flatMap(templateName -> ServerResponse.ok().render(templateName, defaultModel));
            });
    }
}
