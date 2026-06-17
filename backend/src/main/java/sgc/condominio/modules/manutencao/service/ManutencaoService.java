package sgc.condominio.modules.manutencao.service;

import sgc.condominio.modules.manutencao.dto.ManutencaoRequestDTO;
import sgc.condominio.modules.manutencao.dto.ManutencaoResponseDTO;
import sgc.condominio.modules.manutencao.model.Manutencao;
import sgc.condominio.modules.manutencao.model.StatusManutencao;
import sgc.condominio.modules.manutencao.model.TipoManutencao;
import sgc.condominio.modules.manutencao.repository.ManutencaoRepository;
import sgc.condominio.modules.sindico.model.Sindico;
import sgc.condominio.modules.sindico.repository.SindicoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManutencaoService {

    @Autowired
    private ManutencaoRepository manutencaoRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    // --- CRIAR MANUTENÇÃO ---
    @Transactional
    public ManutencaoResponseDTO criar(ManutencaoRequestDTO dto) {
        Sindico sindico = sindicoRepository.findById(dto.getIdSindico())
                .orElseThrow(() -> new RuntimeException("Síndico não encontrado."));

        Manutencao m = new Manutencao();

        m.setTitulo(dto.getTitulo());
        m.setDescricao(dto.getDescricao());
        m.setTipo(TipoManutencao.valueOf(dto.getTipo().toUpperCase()));
        m.setDataInicio(LocalDateTime.parse(dto.getDataInicio()));

        if (dto.getDataFim() != null && !dto.getDataFim().isBlank()) {
            m.setDataFim(LocalDateTime.parse(dto.getDataFim()));
        }
        m.setSindico(sindico);

        return ManutencaoResponseDTO.fromEntity(manutencaoRepository.save(m));
    }

    // --- LISTAR TODAS ---
    public List<ManutencaoResponseDTO> listarTodas() {
        return manutencaoRepository.findAllByOrderByDataInicioDesc()
                .stream()
                .map(ManutencaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // --- LISTAR PRÓXIMAS (PARA MORADORES) ---
    public List<ManutencaoResponseDTO> listarProximas() {
        return manutencaoRepository.findByStatusInOrderByDataInicioAsc(
                Arrays.asList(StatusManutencao.AGENDADA, StatusManutencao.EM_ANDAMENTO)
        ).stream().map(ManutencaoResponseDTO::fromEntity).collect(Collectors.toList());
    }

    // --- ATUALIZAR STATUS ---
    @Transactional
    public ManutencaoResponseDTO atualizarStatus(Long id, String novoStatus) {
        Manutencao m = manutencaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manutenção não encontrada."));

        m.setStatus(StatusManutencao.valueOf(novoStatus.toUpperCase()));
        return ManutencaoResponseDTO.fromEntity(manutencaoRepository.save(m));
    }

    // --- DELETAR ---
    @Transactional
    public void deletar(Long id) {
        if (!manutencaoRepository.existsById(id)) {
            throw new RuntimeException("Manutenção não encontrada.");
        }
        manutencaoRepository.deleteById(id);
    }
}

