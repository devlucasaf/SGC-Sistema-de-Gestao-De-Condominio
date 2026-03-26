package com.condominio.infra.pagination;

import org.springframework.data.domain.Page;
import java.util.List;
import java.util.function.Function;

public class PageMapper {

    public static <E, D> PageResponseDTO<D> toDTO(Page<E> page, Function<E, D> mapper) {

        List<D> listaDTO = page.getContent()
                .stream()
                .map(mapper)
                .toList();

        return new PageResponseDTO<>(
                listaDTO,
                page.getNumber(),
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}