package com.wiily.pscosmeticos.PsAPI.domain.subcategory;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.dto.datas.CreateSubCategoryData;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "sub_categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sub_category_id")
    long id;

    @Column(name = "sub_category_name")
    String name;

    @JoinColumn(name = "sub_category_category_id")
    @ManyToOne
    Category category;

    @OneToMany
    List<Product> product;

    public SubCategory(CreateSubCategoryData data, Category cat) {
        name = data.name();
        category = cat;
    }
}
