package com.wiily.pscosmeticos.PsAPI.service;

import com.wiily.pscosmeticos.PsAPI.domain.product.ingredient.Ingredient;
import com.wiily.pscosmeticos.PsAPI.domain.product.ingredient.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class
IngredientService {

    @Autowired
    IngredientRepository ingredientRepository;

    public List<Ingredient> createIngredients(List<String> ingredients) {
        List<Ingredient> ingredientList = new ArrayList<>();
        for (String i : ingredients) {
            Optional<Ingredient> optionalIngredient = ingredientRepository.findByIngredientEqualsIgnoreCase(i);
            if (optionalIngredient.isEmpty()) {
                var ing = new Ingredient(i);
                ingredientList.add(ing);
                ingredientRepository.save(ing);
            } else {
                var ing = optionalIngredient.get();
                ingredientList.add(ing);
            }
        }
        return ingredientList;
    }
}
