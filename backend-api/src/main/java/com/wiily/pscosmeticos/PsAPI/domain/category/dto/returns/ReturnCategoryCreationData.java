package com.wiily.pscosmeticos.PsAPI.domain.category.dto.returns;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;

public record ReturnCategoryCreationData(Long id,
                                         String nome,
                                         String slug,
                                         String descricao,
                                         String imagem,
                                         int totalprotudos,
                                         Boolean ativo) {
    public ReturnCategoryCreationData(Category category) {
        this(
                category.getId(),
                category.getNome(),
                category.getSlug(),
                category.getDescricao(),
                category.getImageUrl(),
                category.getTotalProdutos(),
                category.getAtivo()
        );
    }
}
