package com.condominio.modules.documento.service;

import com.condominio.modules.documento.dto.DocumentoRequestDTO;
import com.condominio.modules.documento.dto.DocumentoResponseDTO;
import com.condominio.modules.documento.model.Documento;
import com.condominio.modules.documento.repository.DocumentoRepository;
import com.condominio.modules.sindico.model.Sindico;
import com.condominio.modules.sindico.repository.SindicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentoService {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    @Transactional
    public DocumentoResponseDTO criar(DocumentoRequestDTO dto) {
        Sindico sindico = sindicoRepository.findById(dto.getIdSindico())
                .orElseThrow(() -> new RuntimeException("Síndico não encontrado."));

        Documento doc = new Documento();

        doc.setTitulo(dto.getTitulo());
        doc.setConteudo(dto.getConteudo());
        doc.setCategoria(dto.getCategoria().toUpperCase());
        doc.setDataCriacao(LocalDateTime.now());
        doc.setSindico(sindico);

        Documento salvo = documentoRepository.save(doc);
        return DocumentoResponseDTO.fromEntity(salvo);
    }

    public List<DocumentoResponseDTO> listarTodos() {
        return documentoRepository.findAllByOrderByDataCriacaoDesc()
                .stream()
                .map(DocumentoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DocumentoResponseDTO> listarPorCategoria(String categoria) {
        return documentoRepository.findByCategoriaOrderByDataCriacaoDesc(categoria.toUpperCase())
                .stream()
                .map(DocumentoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public DocumentoResponseDTO atualizar(Long id, DocumentoRequestDTO dto) {
        Documento doc = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado."));

        doc.setTitulo(dto.getTitulo());
        doc.setConteudo(dto.getConteudo());
        doc.setCategoria(dto.getCategoria().toUpperCase());
        doc.setDataAtualizacao(LocalDateTime.now());

        Documento atualizado = documentoRepository.save(doc);
        return DocumentoResponseDTO.fromEntity(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!documentoRepository.existsById(id)) {
            throw new RuntimeException("Documento não encontrado.");
        }
        documentoRepository.deleteById(id);
    }
}

