package com.wiily.pscosmeticos.PsAPI.domain.product.editProductClasses;

import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import org.springframework.stereotype.Component;

@Component
public class EditProductColor implements EditProduct{

    public void edit(Product p, CreateProductData data) {
        var map = data.cores();
        p.setMultiColor(map);
    }
}
