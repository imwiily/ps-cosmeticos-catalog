package com.wiily.pscosmeticos.PsAPI.domain.category.dto.returns;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;

public record ReturnCategoryData (
        Long id,
        String nome,
        String slug,
        String descricao,
        String imageUrl,
        int totalProdutos,
        boolean ativo
) {
    public ReturnCategoryData(Category c) {
        this(
                c.getId(),
                c.getNome(),
                c.getSlug(),
                c.getDescricao(),
                c.getImageUrl(),
                c.getTotalProdutos(),
                c.getAtivo()
        );
    }
}
