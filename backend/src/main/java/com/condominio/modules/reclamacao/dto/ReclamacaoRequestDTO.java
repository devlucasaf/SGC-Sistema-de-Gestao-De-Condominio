package com.condominio.modules.reclamacao.dto;

public record ReclamacaoRequestDTO(
        String tipo,
        String categoria,
        String descricao,
        String unidadeAlvo
) {}