package com.condominio.service;

import com.condominio.dto.morador.MoradorCreateRequest;
import com.condominio.dto.morador.MoradorResponse;
import com.condominio.dto.morador.MoradorUpdateRequest;

import java.util.List;

public interface MoradorService {

    List<MoradorResponse> listar();

    MoradorResponse buscarPorId(Long id);

    MoradorResponse buscarPorEmail(String email);

    MoradorResponse criar(MoradorCreateRequest request);

    MoradorResponse atualizar(Long id, MoradorUpdateRequest request);

    void remover(Long id);
}
