package sgc.condominio.modules.infracao.service;

import sgc.condominio.modules.infracao.dto.InfracaoRequestDTO;
import sgc.condominio.modules.infracao.dto.InfracaoResponseDTO;
import sgc.condominio.modules.infracao.model.Infracao;
import sgc.condominio.modules.infracao.model.StatusInfracao;
import sgc.condominio.modules.infracao.model.TipoInfracao;
import sgc.condominio.modules.infracao.repository.InfracaoRepository;
import sgc.condominio.modules.morador.model.Morador;
import sgc.condominio.modules.usuario.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InfracaoService {

    @Autowired
    private InfracaoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public InfracaoResponseDTO criar(InfracaoRequestDTO dto) {
        Infracao infracao = new Infracao();

        infracao.setTipo(dto.getTipo());
        infracao.setMotivo(dto.getMotivo());
        infracao.setDescricao(dto.getDescricao());
        infracao.setMoradorId(dto.getMoradorId());
        infracao.setDataInfracao(LocalDate.parse(dto.getDataInfracao()));

        if (dto.getTipo() == TipoInfracao.MULTA) {
            infracao.setValor(dto.getValor() != null ? dto.getValor() : BigDecimal.ZERO);
        } 
        
        else {
            infracao.setValor(BigDecimal.ZERO);
        }

        // --- BUSCA DADOS DO MORADOR ---
        usuarioRepository.findById(dto.getMoradorId()).ifPresent(usuario -> {
            infracao.setNomeMorador(usuario.getNome());
            if (usuario instanceof Morador) {
                Morador morador = (Morador) usuario;
                if (morador.getUnidade() != null) {
                    infracao.setUnidadeMorador(
                        "Apto " + morador.getUnidade().getNumeroApto() +
                        " - Bloco " + morador.getUnidade().getBloco()
                    );
                }
            }
        });

        Infracao salva = repository.save(infracao);
        return toDTO(salva);
    }

    @Transactional(readOnly = true)
    public List<InfracaoResponseDTO> listarTodas() {
        return repository.findAllByOrderByDataCriacaoDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InfracaoResponseDTO> listarPorMorador(Long moradorId) {
        return repository.findByMoradorIdOrderByDataCriacaoDesc(moradorId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void atualizarStatus(Long id, StatusInfracao novoStatus) {
        Infracao infracao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Infração não encontrada."));
        infracao.setStatus(novoStatus);
        repository.save(infracao);
    }

    private InfracaoResponseDTO toDTO(Infracao i) {
        InfracaoResponseDTO dto = new InfracaoResponseDTO();

        dto.setId(i.getId());
        dto.setTipo(i.getTipo());
        dto.setMotivo(i.getMotivo());
        dto.setDescricao(i.getDescricao());
        dto.setValor(i.getValor());
        dto.setStatus(i.getStatus());
        dto.setMoradorId(i.getMoradorId());
        dto.setNomeMorador(i.getNomeMorador());
        dto.setUnidadeMorador(i.getUnidadeMorador());
        dto.setDataInfracao(i.getDataInfracao());
        dto.setDataCriacao(i.getDataCriacao());
        
        return dto;
    }
}

