package com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions;

public class SubCategoryNotBelongToCategory extends RuntimeException {
    public SubCategoryNotBelongToCategory(String message) {
        super(message);
    }
}
