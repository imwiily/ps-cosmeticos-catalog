package com.wiily.pscosmeticos.PsAPI.domain.product.ingredient;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name =  "ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id")
    Long id;

    @Column(name = "ingredient_name")
    String ingredient;

    public Ingredient(String ingredientName) {
        ingredient = ingredientName;
    }

    @Override
    public String toString() {
        return ingredient;
    }
}
