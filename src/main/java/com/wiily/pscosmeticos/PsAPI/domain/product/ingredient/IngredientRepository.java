package com.wiily.pscosmeticos.PsAPI.domain.product.ingredient;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    Optional<Ingredient> findByIngredientEqualsIgnoreCase(String ingredient);
}
