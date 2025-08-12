package com.wiily.pscosmeticos.PsAPI.domain.product.editProductClasses;

import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import org.springframework.stereotype.Component;

@Component
public class EditProductDescription implements EditProduct{

    public void edit(Product p, CreateProductData data) {
        p.setDescription(data.descricao());
    }
}
