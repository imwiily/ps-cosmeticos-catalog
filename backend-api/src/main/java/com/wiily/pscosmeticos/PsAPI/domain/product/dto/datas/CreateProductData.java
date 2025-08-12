package com.wiily.pscosmeticos.PsAPI.domain.product.dto.datas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

public record CreateProductData(
        @NotBlank
        String nome,
        @NotBlank
        String tipo,
        @NotNull
        int categoria,
        Integer sub_categoria,
        @NotNull
        double preco,
        double precoDesconto,
        Map<String, String> cores,
        @NotNull
        String descricao,
        @NotNull
        String descricaoCompleta,
        List<String> ingredientes,
        String modoUso,
        List<String> tags,
        boolean ativo
) {}
