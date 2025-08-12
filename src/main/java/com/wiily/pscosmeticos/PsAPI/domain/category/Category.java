package com.wiily.pscosmeticos.PsAPI.domain.category;

import com.wiily.pscosmeticos.PsAPI.domain.category.dto.datas.CreateCategoryData;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.SubCategory;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "categories")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    Long id;

    @Column(name = "category_name")
    String nome;

    @Column(name = "category_slug")
    String slug;

    @Column(name = "category_description")
    String descricao;

    @Column(name = "category_image_url")
    String imageUrl;

    @OneToMany(mappedBy = "category")
    List<Product> products;

    @OneToMany(mappedBy = "category")
    List<SubCategory> subCategories;

    @Column(name = "category_total_products")
    int totalProdutos;

    @Column(name = "category_active")
    Boolean ativo;

    public Category(@Valid CreateCategoryData categoryData) {
        nome = categoryData.nome();
        slug = createSlug(categoryData.nome());
        descricao = categoryData.descricao();
        totalProdutos = 0;
        ativo = categoryData.ativo();
    }

    public void setNome(String name) {
        nome = name;
        slug = createSlug(nome);
    }

    private String createSlug(@NotBlank String nome) {
        return nome.toLowerCase().replace(" ", "-");
    }
}
