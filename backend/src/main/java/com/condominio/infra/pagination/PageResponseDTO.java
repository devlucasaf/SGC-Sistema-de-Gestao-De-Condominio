package com.condominio.infra.pagination;

import lombok.Data;
import java.util.List;

@Data
public class PageResponseDTO<T> {

    private List<T>     conteudo;
    private int         pagina;
    private int         tamanho;
    private int         totalPaginas;
    private long        totalElementos;

    public PageResponseDTO(List<T> conteudo, int pagina, int tamanho, int totalPaginas, long totalElementos) {
        this.conteudo = conteudo;
        this.pagina = pagina;
        this.tamanho = tamanho;
        this.totalPaginas = totalPaginas;
        this.totalElementos = totalElementos;
    }
}
