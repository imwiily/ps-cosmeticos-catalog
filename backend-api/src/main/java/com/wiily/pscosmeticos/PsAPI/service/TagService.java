package com.wiily.pscosmeticos.PsAPI.service;

import com.wiily.pscosmeticos.PsAPI.domain.product.tag.Tag;
import com.wiily.pscosmeticos.PsAPI.domain.product.tag.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagService {
    @Autowired
    TagRepository repository;

    public List<Tag> createTags(List<String> tags) {
        List<Tag> tagList = new ArrayList<>();
        for (String tag : tags) {
            var tagOptional = repository.findByNameEqualsIgnoreCase(tag);
            if (tagOptional.isPresent()) {
                tagList.add(tagOptional.get());
                System.out.println("Tag existe no DB: " + tagOptional.get().getName());
            } else {
                System.out.println("Tag não existe, criando tag...");
                var newTag = new Tag(tag);
                repository.save(newTag);
                tagList.add(newTag);
            }
        }
        return tagList;
    }

}
