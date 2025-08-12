package com.wiily.pscosmeticos.PsAPI.service;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;
import com.wiily.pscosmeticos.PsAPI.domain.category.CategoryRepository;
import com.wiily.pscosmeticos.PsAPI.domain.category.dto.datas.EditCategoryData;
import com.wiily.pscosmeticos.PsAPI.domain.product.ProductRepository;
import com.wiily.pscosmeticos.PsAPI.domain.ApiResponse;
import com.wiily.pscosmeticos.PsAPI.infra.config.AppProperties;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.BiConsumer;

@Service
public class CategoryService {
    @Autowired
    CategoryRepository repository;
    @Autowired
    AppProperties properties;
    @Autowired
    ImageService imageService;
    @Autowired
    ProductRepository productRepository;

    public Category editCategory(@Valid EditCategoryData cd, MultipartFile image) {
        var c = repository.getReferenceById(cd.id());
        edit(cd.nome(), c, Category::setNome);
        edit(cd.descricao(), c, Category::setDescricao);
        edit(cd.ativo(), c, Category::setAtivo);
        if (image != null) {
            editImage(c, image);
        }
        repository.save(c);
        return c;
    }
    private void editImage(Category category, MultipartFile image) {
        try {
            String path = properties.getStorage().getImageCategoryRoot() + imageService.getImagePath(category);
            Files.delete(Path.of(path));
            category.setImageUrl(imageService.imageProcessor(image, category));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private <T, V> void edit(V value, T obj, BiConsumer<T, V> setter) {
        if (value != null) {
            setter.accept(obj, value);
        }
    }

    public Object deleteCategory(Long id) throws IOException {
        var category = repository.getReferenceById(id);
        var products = productRepository.findByCategory(category);
        if (!products.isEmpty()) return ResponseEntity.badRequest().body(new ApiResponse(false, "C.ITDx0001", "The category has products inside!"));
        Files.delete(Path.of(properties.getStorage().getImageCategoryRoot() + imageService.getImagePath(category)));
        repository.delete(category);
        return null;
    }
}
