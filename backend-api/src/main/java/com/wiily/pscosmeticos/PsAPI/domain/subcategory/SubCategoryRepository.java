package com.wiily.pscosmeticos.PsAPI.domain.subcategory;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    @Query("""
            select s
            FROM SubCategory s
            WHERE s.id = :sub_category_id
            AND s.category = :category
            """)
    Optional<SubCategory> subCategoryFindByCategory(Category category, int sub_category_id);
}
