package com.wiily.pscosmeticos.PsAPI.controller;

import com.wiily.pscosmeticos.PsAPI.domain.category.CategoryRepository;
import com.wiily.pscosmeticos.PsAPI.domain.ApiResponse;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.*;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.dto.datas.CreateSubCategoryData;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.dto.returns.ReturnSubCategoryData;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/subcategorias")
public class SubCategoryController {
    @Autowired
    SubCategoryRepository repository;
    @Autowired
    CategoryRepository categoryRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<Object> createSubCategory(@RequestBody @Valid CreateSubCategoryData data,
                                                    UriComponentsBuilder uriBuilder) {
        System.out.println(data);
        var cat = categoryRepository.getReferenceById((long) data.categoryId());
        System.out.println(cat.getNome() + " " + cat.getId());
        var sub = new SubCategory(data, cat);
        repository.save(sub);
        var uri = uriBuilder.path("/api/v1/subcategorias").buildAndExpand(sub.getId()).toUri();
        return ResponseEntity.created(uri).body(new ApiResponse(true, new ReturnSubCategoryData(sub)));
    }

    @GetMapping
    public ResponseEntity<Page<ReturnSubCategoryData>> getSubCategories(Pageable pageable) {
        var page = repository.findAll(pageable).map(ReturnSubCategoryData::new);
        return ResponseEntity.ok(page);
    }

}
