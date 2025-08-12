package com.wiily.pscosmeticos.PsAPI.domain.product;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryNomeIgnoreCase(String categoryName, Pageable pageable);

    List<Product> findByCategory(Category category);
}
