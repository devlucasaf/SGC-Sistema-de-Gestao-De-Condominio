package sgc.condominio.modules.porteiro.service;

import sgc.condominio.modules.porteiro.dto.PorteiroRequestDTO;
import sgc.condominio.modules.porteiro.dto.PorteiroResponseDTO;
import sgc.condominio.modules.porteiro.model.Porteiro;
import sgc.condominio.modules.porteiro.repository.PorteiroRepository;

import sgc.condominio.modules.usuario.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class PorteiroService {

    @Autowired
    private PorteiroRepository porteiroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public PorteiroResponseDTO cadastrar(PorteiroRequestDTO dto) {

        // --- VALIDAÇÃO GLOBAL DE CPF E E-MAIL ---
        if (usuarioRepository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("Erro: CPF já cadastrado no sistema.");
        }
        
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Erro: E-mail já utilizado por outro usuário.");
        }

        // --- CRIAÇÃO DA ENTIDADE ---
        Porteiro porteiro = new Porteiro(
                dto.getNome(),
                dto.getDataNascimento(),
                dto.getCpf(),
                dto.getEmail(),
                passwordEncoder.encode(dto.getSenha()),
                dto.getTelefone(),
                dto.getMatricula()
        );

        // --- SALVA NO BANCO DE DADOS ---
        porteiroRepository.save(porteiro);

        return PorteiroResponseDTO.fromEntity(porteiro);
    }
}