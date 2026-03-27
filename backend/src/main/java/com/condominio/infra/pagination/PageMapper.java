package com.condominio.infra.pagination;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PageMapper {

    public static <E, D> PageResponseDTO<D> toDTO(Page<E> page, Function<E, D> mapper) {

        List<D> listaDTO = page.getContent()
                .stream()
                .map(mapper)
                .collect(Collectors.toList());

        return new PageResponseDTO<D>(
                listaDTO,
                page.getNumber(),
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}