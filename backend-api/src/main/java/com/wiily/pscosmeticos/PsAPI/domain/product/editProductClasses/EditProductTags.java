package com.wiily.pscosmeticos.PsAPI.domain.product.editProductClasses;

import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import com.wiily.pscosmeticos.PsAPI.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EditProductTags implements EditProduct {

    @Autowired
    TagService tagService;

    public void edit(Product p, CreateProductData data) {
        var tagList = tagService.createTags(data.tags());
        p.setTags(tagList);
    }
}
