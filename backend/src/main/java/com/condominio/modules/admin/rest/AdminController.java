package com.condominio.modules.admin.rest;

import com.condominio.modules.admin.dto.AdminDashboardDTO;
import com.condominio.modules.admin.dto.CriarSindicoDTO;

import com.condominio.modules.sindico.model.Sindico;
import com.condominio.modules.sindico.repository.SindicoRepository;

import com.condominio.modules.usuario.model.TipoUsuario;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;

import com.condominio.modules.morador.repository.MoradorRepository;
import com.condominio.modules.porteiro.repository.PorteiroRepository;
import com.condominio.modules.unidade.repository.UnidadeRepository;
import com.condominio.modules.reserva.repository.ReservaRepository;
import com.condominio.modules.manutencao.repository.ManutencaoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private PorteiroRepository porteiroRepository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ManutencaoRepository manutencaoRepository;

    @Autowired

    private PasswordEncoder passwordEncoder;

    // --- DASHBOARD COM ESTATÍSTICAS GERAIS ---
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> dashboard() {
        AdminDashboardDTO dto = new AdminDashboardDTO();

        dto.setTotalUsuarios(usuarioRepository.count());
        dto.setTotalMoradores(moradorRepository.count());
        dto.setTotalSindicos(sindicoRepository.count());
        dto.setTotalPorteiros(porteiroRepository.count());
        dto.setTotalUnidades(unidadeRepository.count());
        dto.setTotalReservas(reservaRepository.count());
        dto.setTotalManutencoes(manutencaoRepository.count());

        return ResponseEntity.ok(dto);
    }

    // --- LISTAR TODOS OS SÍNDICOS ---
    @GetMapping("/sindicos")
    public ResponseEntity<List<Map<String, Object>>> listarSindicos() {
        List<Sindico> sindicos = sindicoRepository.findAll();
        List<Map<String, Object>> lista = sindicos.stream().map(s -> {
            Map<String, Object> map = new LinkedHashMap<>();

            map.put("id", s.getId());
            map.put("nome", s.getUsuario().getNome());
            map.put("email", s.getUsuario().getEmail());
            map.put("cpf", s.getUsuario().getCpf());
            map.put("telefone", s.getUsuario().getTelefone());
            map.put("status", s.getStatus());
            map.put("dataInicioMandato", s.getDataInicioMandato());
            map.put("dataFimMandato", s.getDataFimMandato());

            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    // --- CRIAR SÍNDICO ---
    @PostMapping("/sindicos")
    public ResponseEntity<?> criarSindico(@RequestBody @Valid CriarSindicoDTO dto) {
        // --- VERIFICA SE JÁ EXISTE USUÁRIO COM ESSE EMAIL OU CPF ---
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "E-mail já cadastrado."));
        }

        // --- CRIA O USUÁRIO ---
        Usuario usuario = new Usuario();

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        usuario.setTelefone(dto.getTelefone());
        usuario.setDataNascimento(LocalDate.parse(dto.getDataNascimento()));
        usuario.setTipoUsuario(TipoUsuario.SINDICO);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // --- CRIA O SÍNDICO ---
        Sindico sindico = new Sindico();

        sindico.setUsuario(usuarioSalvo);
        sindico.setDataInicioMandato(LocalDate.now());
        sindico.setStatus("ATIVO");

        sindicoRepository.save(sindico);

        return ResponseEntity.status(HttpStatus.CREATED).body(Collections.singletonMap("message", "Síndico criado com sucesso!"));
    }

    // --- REMOVER SÍNDICO ---
    @DeleteMapping("/sindicos/{id}")
    public ResponseEntity<Void> removerSindico(@PathVariable Long id) {
        Sindico sindico = sindicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Síndico não encontrado."));

        sindicoRepository.delete(sindico);
        usuarioRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // --- LISTAR TODOS OS USUÁRIOS ---
    @GetMapping("/usuarios")
    public ResponseEntity<List<Map<String, Object>>> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<Map<String, Object>> lista = usuarios.stream().map(u -> {
            Map<String, Object> map = new LinkedHashMap<>();

            map.put("id", u.getId());
            map.put("nome", u.getNome());
            map.put("email", u.getEmail());
            map.put("tipoUsuario", u.getTipoUsuario().name());
            map.put("cpf", u.getCpf());

            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }
}

