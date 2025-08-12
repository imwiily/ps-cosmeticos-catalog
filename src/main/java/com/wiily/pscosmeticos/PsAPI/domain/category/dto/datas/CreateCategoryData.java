package com.wiily.pscosmeticos.PsAPI.domain.category.dto.datas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCategoryData(
        @NotBlank
        String nome,
        @NotBlank
        String descricao,
        @NotNull
        Boolean ativo
) {
}
