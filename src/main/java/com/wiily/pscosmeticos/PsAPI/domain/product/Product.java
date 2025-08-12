package com.wiily.pscosmeticos.PsAPI.domain.product;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;
import com.wiily.pscosmeticos.PsAPI.domain.product.ingredient.Ingredient;
import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import com.wiily.pscosmeticos.PsAPI.domain.product.tag.Tag;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.SubCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    Long id;

    @Column(name = "product_name")
    String name;

    @Column(name = "product_type")
    @Enumerated(EnumType.STRING)
    PRODUCT_TYPE type;

    @Column(name = "product_slug")
    String slug;

    @Column(name = "product_image")
    String image;

    @JoinColumn(name = "product_category")
    @ManyToOne
    Category category;

    @JoinColumn(name = "product_sub_category")
    @ManyToOne
    SubCategory subCategory;

    @Column(name = "product_price")
    double price;

    @Column(name = "product_discount_price")
    double discountPrice;

    @ElementCollection
    @CollectionTable(
            name = "product_attributes",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @MapKeyColumn(name = "attr_key")
    @Column(name = "attr_value")
    Map<String, String> multiColor;

    @Column(name = "product_description")
    String description;

    @Column(name = "product_complete_description")
    String completeDescription;

    @ManyToMany
    @JoinTable(
            name = "product_ingredient",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    List<Ingredient> ingredientList;

    @Column(name = "product_how_to_use")
    String howToUse;

    @ManyToMany
    @JoinTable(
            name = "product_tag",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    List<Tag> tags;

    @Column(name = "product_active")
    Boolean active;

    @Column(name = "product_create_at")
    LocalDateTime createdTime;

    @Column(name = "product_update_at")
    LocalDateTime updateTime;

    @Transient
    ZoneId zone = ZoneId.of("America/Sao_Paulo");

    public Product(CreateProductData data,
                   Category category,
                   List<Ingredient> ingredients,
                   List<Tag> tags,
                   SubCategory subCategory,
                   PRODUCT_TYPE type,
                   Map<String, String> map) {
        name = data.nome();
        slug = data.nome().replace(" ", "-").toLowerCase();
        price = data.preco();
        discountPrice = data.precoDesconto();
        description = data.descricao();
        completeDescription = data.descricaoCompleta();
        howToUse = data.modoUso();
        active = data.ativo();
        createdTime = LocalDateTime.now(zone);
        this.category = category;
        this.subCategory = subCategory;
        ingredientList = ingredients;
        this.tags = tags;
        this.type = type;
        if (!map.isEmpty()) {
            multiColor = map;
        }
    }

    public void setName(String name) {
        this.name = name;
        slug = name.replace(" ", "-").toLowerCase();
    }

}
