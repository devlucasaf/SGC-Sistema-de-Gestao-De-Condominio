package com.condominio.service;

import com.condominio.dto.morador.MoradorCreateRequest;
import com.condominio.modules.morador.dto.MoradorResponseDTO;
import com.condominio.dto.morador.MoradorUpdateRequest;

import java.util.List;

public interface MoradorService {

    List<MoradorResponseDTO> listar();

    MoradorResponseDTO buscarPorId(Long id);

    MoradorResponseDTO buscarPorEmail(String email);

    MoradorResponseDTO criar(MoradorCreateRequest request);

    MoradorResponseDTO atualizar(Long id, MoradorUpdateRequest request);

    void remover(Long id);
}
