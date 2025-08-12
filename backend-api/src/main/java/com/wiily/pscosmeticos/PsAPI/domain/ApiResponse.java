package com.wiily.pscosmeticos.PsAPI.domain;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse(Boolean success, String errorCode, Object data) {
    public ApiResponse(Boolean bool, Object data) {
        this(
                bool,
                null,
                data
        );
    }
}
