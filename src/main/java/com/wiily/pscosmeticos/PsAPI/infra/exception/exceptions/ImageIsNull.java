package com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class ImageIsNull extends RuntimeException{
    String title = "The image is null!";
    String message;

    Map<String, Object> map = new HashMap<>();
    public ImageIsNull(String message) {
        this.message = message;
    }

    public Map<String, Object> getMap() {
        map.put("title", title);
        map.put("message", message);
        return map;
    }
}
