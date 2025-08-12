package com.wiily.pscosmeticos.PsAPI.domain.subcategory.dto.returns;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.SubCategory;

public record ReturnSubCategoryData(
        Long id,
        String name,
        ReturnCategoryInfo category_info
) {
    public ReturnSubCategoryData(SubCategory s) {
        this(
                s.getId(),
                s.getName(),
                new ReturnCategoryInfo(s.getCategory())
        );
    }
}

record ReturnCategoryInfo(
        Long id,
        String name
) {
    public ReturnCategoryInfo(Category c) {
        this(
                c.getId(),
                c.getNome()
        );
    }
}
