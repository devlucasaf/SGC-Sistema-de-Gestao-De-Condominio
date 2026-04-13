package com.condominio.modules.documento.dto;

import com.condominio.modules.documento.model.Documento;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentoResponseDTO {

    private Long          id;
    private String        titulo;
    private String        conteudo;
    private String        categoria;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private String        nomeSindico;

    public static DocumentoResponseDTO fromEntity(Documento doc) {
        DocumentoResponseDTO dto = new DocumentoResponseDTO();

        dto.setId(doc.getId());
        dto.setTitulo(doc.getTitulo());
        dto.setConteudo(doc.getConteudo());
        dto.setCategoria(doc.getCategoria());
        dto.setDataCriacao(doc.getDataCriacao());
        dto.setDataAtualizacao(doc.getDataAtualizacao());
        dto.setNomeSindico(doc.getSindico().getUsuario().getNome());

        return dto;
    }
}

