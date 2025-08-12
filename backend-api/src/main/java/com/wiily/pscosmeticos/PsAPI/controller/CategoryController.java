package com.wiily.pscosmeticos.PsAPI.controller;

import com.wiily.pscosmeticos.PsAPI.domain.category.*;
import com.wiily.pscosmeticos.PsAPI.domain.category.dto.datas.CreateCategoryData;
import com.wiily.pscosmeticos.PsAPI.domain.category.dto.datas.EditCategoryData;
import com.wiily.pscosmeticos.PsAPI.domain.category.dto.returns.ReturnCategoryCreationData;
import com.wiily.pscosmeticos.PsAPI.domain.category.dto.returns.ReturnCategoryData;
import com.wiily.pscosmeticos.PsAPI.domain.category.dto.returns.ReturnCategoryEditedData;
import com.wiily.pscosmeticos.PsAPI.domain.subcategory.dto.returns.ReturnSubCategoryData;
import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.ImageIsNull;
import com.wiily.pscosmeticos.PsAPI.domain.ApiResponse;
import com.wiily.pscosmeticos.PsAPI.service.CategoryService;
import com.wiily.pscosmeticos.PsAPI.service.ImageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoryController {
    @Autowired
    CategoryRepository repository;
    @Autowired
    ImageService imageService;
    @Autowired
    CategoryService service;

    @GetMapping
    public ResponseEntity<Page<ReturnCategoryData>> getCategories(@PageableDefault(size = 12) Pageable pageable) {
        var page = repository.findAll(pageable).map(ReturnCategoryData::new);
        return ResponseEntity.ok(page);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Object> createCategory(@RequestPart(name = "dados") @Valid CreateCategoryData categoryData,
                                                 @RequestPart(name = "imagem") MultipartFile image,
                                                 UriComponentsBuilder uriBuilder) {
        if (image.isEmpty()) throw new ImageIsNull("The image sent to the API doesn't exist");
        var category = new Category(categoryData);
        category.setImageUrl(imageService.imageProcessor(image, category));
        repository.save(category);
        var uri = uriBuilder.path("/api/v1/categorias").buildAndExpand(category.getId()).toUri();
        return ResponseEntity.created(uri).body(new ApiResponse(true, new ReturnCategoryCreationData(category)));
    }

    @DeleteMapping("{id}")
    @Transactional
    public ResponseEntity<Object> deleteCategory(@PathVariable Long id) throws IOException {
        var response = service.deleteCategory(id);
        return ResponseEntity.ok().body(new ApiResponse(true, response));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<Object> editCategory(@RequestPart(name = "dados") @Valid EditCategoryData categoryData,
                                               @RequestPart(name = "imagem", required = false) MultipartFile image) {
        var category = service.editCategory(categoryData, image);
        return ResponseEntity.ok().body(new ApiResponse(true, new ReturnCategoryEditedData(category)));
    }

    @GetMapping("/subcategorias/{id}")
    public ResponseEntity<Object> getSubcategories(@PathVariable Long id) {
        var category = repository.getReferenceById(id);
        var sub = category.getSubCategories().stream().map(ReturnSubCategoryData::new);
        return ResponseEntity.ok(new ApiResponse(true, sub));
    }


}
