package com.wiily.pscosmeticos.PsAPI.domain.product.dto.returns;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.wiily.pscosmeticos.PsAPI.domain.category.Category;
import com.wiily.pscosmeticos.PsAPI.domain.product.ingredient.Ingredient;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import com.wiily.pscosmeticos.PsAPI.domain.product.tag.Tag;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.SubCategory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ReturnProductGetter(Long id,
                                  String name,
                                  String slug,
                                  String tipo,
                                  Map<String, String> cores,
                                  String imageURL,
                                  CategoryRecord category,
                                  SubCategoryRecord subcategory,
                                  double price,
                                  double discountPrice,
                                  String description,
                                  String completeDescription,
                                  List<String> ingredients,
                                  String howToUse,
                                  List<String> tags,
                                  boolean active,
                                  LocalDateTime createAt,
                                  LocalDateTime updateAt) {
    public ReturnProductGetter(Product p) {
        this(
                p.getId(),
                p.getName(),
                p.getSlug(),
                p.getType().toString(),
                p.getMultiColor(),
                p.getImage(),
                new CategoryRecord(p.getCategory()),
                new SubCategoryRecord(p.getSubCategory()),
                p.getPrice(),
                p.getDiscountPrice(),
                p.getDescription(),
                p.getCompleteDescription(),
                p.getIngredientList().stream().map(Ingredient::getIngredient).toList(),
                p.getHowToUse(),
                p.getTags().stream().map(Tag::getName).toList(),
                p.getActive(),
                p.getCreatedTime(),
                p.getUpdateTime()
        );
    }
}
record CategoryRecord(long id,
                      String nome) {
     CategoryRecord(Category c) {
        this(
                c.getId(),
                c.getNome());
    }
}
record SubCategoryRecord(Long id,
                         String nome) {
    SubCategoryRecord(SubCategory sc) {
        this(
                Optional.ofNullable(sc)
                        .map(SubCategory::getId)
                        .orElse(null),
                Optional.ofNullable(sc)
                        .map(SubCategory::getName)
                        .orElse("Sem subcategoria")
        );
    }
}

