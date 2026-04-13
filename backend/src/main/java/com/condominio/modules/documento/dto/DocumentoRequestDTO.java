package com.condominio.modules.documento.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class DocumentoRequestDTO {

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    @NotBlank(message = "O conteúdo é obrigatório")
    private String conteudo;

    @NotBlank(message = "A categoria é obrigatória")
    private String categoria;

    @NotNull(message = "O ID do síndico é obrigatório")
    private Long idSindico;
}

