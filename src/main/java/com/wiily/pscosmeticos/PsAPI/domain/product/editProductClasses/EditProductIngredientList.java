package com.wiily.pscosmeticos.PsAPI.domain.product.editProductClasses;

import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import com.wiily.pscosmeticos.PsAPI.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EditProductIngredientList implements EditProduct {
    @Autowired
    IngredientService ingredientService;
    public void edit(Product p, CreateProductData data) {
        var ingredientList = ingredientService.createIngredients(data.ingredientes());
        p.setIngredientList(ingredientList);
    }
}
