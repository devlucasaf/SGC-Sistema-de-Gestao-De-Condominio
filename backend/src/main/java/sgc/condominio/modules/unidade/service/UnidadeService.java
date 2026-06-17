package sgc.condominio.modules.unidade.service;

import sgc.condominio.modules.unidade.dto.UnidadeRequestDTO;
import sgc.condominio.modules.unidade.dto.UnidadeResponseDTO;
import sgc.condominio.modules.unidade.model.Unidade;
import sgc.condominio.modules.unidade.repository.UnidadeRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnidadeService {

    @Autowired
    private UnidadeRepository unidadeRepository;

    // --- CADASTRAR UNIDADE ---
    @Transactional
    public UnidadeResponseDTO cadastrar(UnidadeRequestDTO dto) {
        Unidade unidade = new Unidade();

        unidade.setBloco(dto.getBloco());
        unidade.setAndar(dto.getAndar());
        unidade.setNumeroApto(dto.getNumeroApto());

        unidadeRepository.save(unidade);

        return UnidadeResponseDTO.fromEntity(unidade);
    }

    // --- LISTAR TODAS ---
    public List<UnidadeResponseDTO> listarTodas() {
        return unidadeRepository.findAll().stream()
                .map(UnidadeResponseDTO::fromEntity)
                .collect(Collectors.toList());    }
}
