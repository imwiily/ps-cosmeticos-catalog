package com.wiily.pscosmeticos.PsAPI.domain.product.tag;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByNameEqualsIgnoreCase(String name);
}
