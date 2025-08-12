package com.wiily.pscosmeticos.PsAPI.domain.product.editProductClasses;

import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EditProductSubCategory implements EditProduct {

    @Autowired
    SubCategoryRepository subCategoryRepository;

    public void edit(Product p, CreateProductData data) {
        if (data.sub_categoria() != null) {
            var sub_category = subCategoryRepository.getReferenceById((long) data.sub_categoria());
            p.setSubCategory(sub_category);
        }
    }
}
