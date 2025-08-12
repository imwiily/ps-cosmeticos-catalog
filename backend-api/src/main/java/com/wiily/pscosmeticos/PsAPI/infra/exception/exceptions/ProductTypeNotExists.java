package com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions;

public class ProductTypeNotExists extends RuntimeException {
    public ProductTypeNotExists(String message) {
        super(message);
    }
}
