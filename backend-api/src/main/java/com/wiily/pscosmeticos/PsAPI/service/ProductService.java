package com.wiily.pscosmeticos.PsAPI.service;

import com.wiily.pscosmeticos.PsAPI.domain.category.CategoryRepository;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.SubCategory;
import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.CategoryNotExist;
import com.wiily.pscosmeticos.PsAPI.domain.product.*;
import com.wiily.pscosmeticos.PsAPI.domain.product.editProductClasses.EditProduct;
import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.SubCategoryRepository;
import com.wiily.pscosmeticos.PsAPI.infra.config.AppProperties;
import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.ProductTypeNotExists;
import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.SubCategoryNotBelongToCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductService {
    @Autowired
    IngredientService ingredientService;
    @Autowired
    TagService tagService;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    ProductRepository repository;
    @Autowired
    AppProperties properties;
    @Autowired
    ImageService imageService;
    @Autowired
    List<EditProduct> edit;
    @Autowired
    SubCategoryRepository subCategoryRepository;

    public Product createProduct(CreateProductData data, MultipartFile image) {
        // Get Category from database

        var category = categoryRepository.findById((long)data.categoria());
        if (category.isEmpty()) throw new CategoryNotExist("The category id '" + data.categoria() + "' do not exist!");
        // Get Sub Category from database
        Optional<SubCategory> sub_category = Optional.empty();
        if (data.sub_categoria() != null) {
            sub_category = subCategoryRepository.subCategoryFindByCategory(category.get(), data.sub_categoria());
            // Check if sub_category is not null, if is, will send a runtime exception.
            if (sub_category.isEmpty()) throw new SubCategoryNotBelongToCategory("Sub-category don't belong to the category.");
        }
        // Get the type of the product
        var type = getType(data.tipo());
        // Get color if is Multi Color.
        Map<String, String> map = new HashMap<>();
        if (type.equals(PRODUCT_TYPE.MULTI_COLOR)) {
            map = data.cores();
        }
        // Create the product with all the information saved.
        var product = new Product(
                data,
                category.get(),
                ingredientService.createIngredients(data.ingredientes()),
                tagService.createTags(data.tags()),
                sub_category.orElse(null),
                type,
                map);
        // Save the image in the root, and return the URL to GET.
        var img = imageService.imageProcessor(image, product);
        // Set image in the product.
        product.setImage(img);
        return product;
    }

    private PRODUCT_TYPE getType(String t) {
        switch (t.toUpperCase()) {
            case "STATIC" -> {
                return PRODUCT_TYPE.STATIC;
            }
            case "MULTI_COLOR" -> {
                return PRODUCT_TYPE.MULTI_COLOR;
            }
            default -> throw new ProductTypeNotExists("The product type you trying to send do not exist!");
        }
    }

    public Product editProduct(CreateProductData data, Product p) {
        edit.forEach(ep -> ep.edit(p, data));
        p.setUpdateTime(LocalDateTime.now(p.getZone()));
        repository.save(p);
        return p;
    }

    public Product editImage(Product product, MultipartFile image) {
        try {
            String path = properties.getStorage().getImageProductRoot() + imageService.getImagePath(product);
            Files.delete(Path.of(path));
            product.setImage(imageService.imageProcessor(image, product));
            return product;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
