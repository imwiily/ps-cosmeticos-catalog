package com.wiily.pscosmeticos.PsAPI.domain.category.dto.datas;

import jakarta.validation.constraints.NotNull;

public record EditCategoryData(
        @NotNull
        long id,
        String nome,
        String descricao,
        Boolean ativo
) {
}
