package com.wiily.pscosmeticos.PsAPI.controller;

import com.wiily.pscosmeticos.PsAPI.domain.product.*;
import com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas.CreateProductData;
import com.wiily.pscosmeticos.PsAPI.domain.product.dto.returns.ReturnProductCreationData;
import com.wiily.pscosmeticos.PsAPI.domain.product.dto.returns.ReturnProductGetter;
import com.wiily.pscosmeticos.PsAPI.domain.ApiResponse;
import com.wiily.pscosmeticos.PsAPI.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;


@RestController
@RequestMapping("/api/v1/produtos")
public class ProductController {

    @Autowired
    ProductService service;
    @Autowired
    ProductRepository repository;


    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse> createProduct(@RequestPart(name = "dados") CreateProductData data,
                                                @RequestPart(name = "imagem") MultipartFile image,
                                                UriComponentsBuilder uriBuilder) {
        var product = service.createProduct(data, image);
        repository.save(product);
        var uri = uriBuilder.path("/api/v1/products").buildAndExpand(product.getId()).toUri();
        return ResponseEntity.created(uri).body(new ApiResponse(true, new ReturnProductCreationData(product)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse> getProducts(@PageableDefault(size = 12) Pageable pageable, @Param("category") String category) {
        Page<ReturnProductGetter> page;
        if (category != null) {
            page = repository.findByCategoryNomeIgnoreCase(category, pageable).map(ReturnProductGetter::new);
        } else {
            page = repository.findAll(pageable).map(ReturnProductGetter::new);
        }
        return ResponseEntity.ok(new ApiResponse(true, page));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse> getProduct(@PathVariable Long id) {
        var product = repository.getReferenceById(id);
        return ResponseEntity.ok(new ApiResponse(true, new ReturnProductGetter(product)));
    }

    @PutMapping("{id}")
    @Transactional
    public ResponseEntity<ApiResponse> editProduct(@RequestPart(name = "dados") CreateProductData data,
                                                   @RequestPart(name = "imagem", required = false) MultipartFile image,
                                                   @PathVariable Long id) {
        var product = service.editProduct(data, repository.getReferenceById(id));
        if (image != null) {
            product = service.editImage(product, image);
        }
        return ResponseEntity.ok(new ApiResponse(true, new ReturnProductGetter(product)));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {
        repository.delete(repository.getReferenceById(id));
        return ResponseEntity.ok(new ApiResponse(true, null));
    }


}
