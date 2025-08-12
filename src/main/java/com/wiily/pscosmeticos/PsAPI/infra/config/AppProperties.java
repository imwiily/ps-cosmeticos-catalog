package com.wiily.pscosmeticos.PsAPI.infra.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Storage storage = new Storage();
    private Api api = new Api();

    @Setter
    @Getter
    public static class Storage {
        private String imageRoot;
        private String imageProductRoot;
        private String imageCategoryRoot;

    }

    @Setter
    @Getter
    public static class Api {
        private String version;
        private String externalServiceUrl;
        private String domainIp;
        private String baseIp;

    }
}
