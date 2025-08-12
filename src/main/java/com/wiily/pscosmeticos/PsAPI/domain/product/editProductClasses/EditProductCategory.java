package com.wiily.pscosmeticos.PsAPI.domain.product.editProductClasses;

import com.wiily.pscosmeticos.PsAPI.domain.category.CategoryRepository;
import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EditProductCategory implements EditProduct{
    @Autowired
    CategoryRepository categoryRepository;

    public void edit(Product p, CreateProductData data) {
        var category = categoryRepository.getReferenceById((long) data.categoria());
        p.setCategory(category);
    }
}
