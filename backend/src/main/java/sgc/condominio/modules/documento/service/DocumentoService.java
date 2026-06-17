package sgc.condominio.modules.documento.service;

import sgc.condominio.modules.documento.dto.DocumentoRequestDTO;
import sgc.condominio.modules.documento.dto.DocumentoResponseDTO;
import sgc.condominio.modules.documento.model.Documento;
import sgc.condominio.modules.documento.repository.DocumentoRepository;
import sgc.condominio.modules.sindico.model.Sindico;
import sgc.condominio.modules.sindico.repository.SindicoRepository;
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
        // --- BUSCA O SÍNDICO PELO ID ---
        Sindico sindico = sindicoRepository.findById(dto.getIdSindico())
                .orElseThrow(() -> new RuntimeException("Síndico não encontrado."));

        // --- MONTA A ENTIDADE DOCUMENTO ---
        Documento doc = new Documento();

        doc.setTitulo(dto.getTitulo());
        doc.setConteudo(dto.getConteudo());
        doc.setCategoria(dto.getCategoria().toUpperCase());
        doc.setDataCriacao(LocalDateTime.now());
        doc.setSindico(sindico);

        // --- SALVA E RETORNA O DTO DE RESPOSTA ---
        Documento salvo = documentoRepository.save(doc);
        return DocumentoResponseDTO.fromEntity(salvo);
    }

    // --- LISTAR TODOS OS DOCUMENTOS ORDENADOS POR DATA DE CRIAÇÃO ---
    public List<DocumentoResponseDTO> listarTodos() {
        return documentoRepository.findAllByOrderByDataCriacaoDesc()
                .stream()
                .map(DocumentoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // --- LISTAR DOCUMENTOS FILTRADOS POR CATEGORIA ---
    public List<DocumentoResponseDTO> listarPorCategoria(String categoria) {
        return documentoRepository.findByCategoriaOrderByDataCriacaoDesc(categoria.toUpperCase())
                .stream()
                .map(DocumentoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // --- ATUALIZAR UM DOCUMENTO EXISTENTE PELO ID ---
    @Transactional
    public DocumentoResponseDTO atualizar(Long id, DocumentoRequestDTO dto) {
        // --- BUSCA O DOCUMENTO PELO ID ---
        Documento doc = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado."));

        doc.setTitulo(dto.getTitulo());
        doc.setConteudo(dto.getConteudo());
        doc.setCategoria(dto.getCategoria().toUpperCase());
        doc.setDataAtualizacao(LocalDateTime.now());

        // --- SALVA E RETORNA O DTO ATUALIZADO ---
        Documento atualizado = documentoRepository.save(doc);
        return DocumentoResponseDTO.fromEntity(atualizado);
    }

    // --- DELETAR UM DOCUMENTO PELO ID ---
    @Transactional
    public void deletar(Long id) {
        // --- VERIFICA SE O DOCUMENTO EXISTE ---
        if (!documentoRepository.existsById(id)) {
            throw new RuntimeException("Documento não encontrado.");
        }
        documentoRepository.deleteById(id);
    }
}
