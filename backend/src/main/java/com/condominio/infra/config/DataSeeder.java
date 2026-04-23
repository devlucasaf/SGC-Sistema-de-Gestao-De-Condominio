package com.condominio.infra.config;

import com.condominio.modules.porteiro.model.Porteiro;
import com.condominio.modules.porteiro.repository.PorteiroRepository;
import com.condominio.modules.reserva.model.AreaLazer;
import com.condominio.modules.reserva.repository.AreaLazerRepository;
import com.condominio.modules.sindico.model.Sindico;
import com.condominio.modules.sindico.repository.SindicoRepository;
import com.condominio.modules.unidade.model.Unidade;
import com.condominio.modules.unidade.repository.UnidadeRepository;
import com.condominio.modules.usuario.model.TipoUsuario;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private PorteiroRepository porteiroRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AreaLazerRepository areaLazerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Iniciando o Data Seeder... Verificando o banco de dados...");

        // --- CORRIGE SENHAS QUE ESTÃO EM TEXTO PURO (SEM BCRYPT) ---
        corrigirSenhasEmTextoPuro();

        if (unidadeRepository.count() == 0) {
            System.out.println("Criando unidades padrão...");

            Unidade unidade1 = new Unidade();
            unidade1.setBloco("A");
            unidade1.setNumeroApto("101");
            unidade1.setAndar(1);

            Unidade unidade2 = new Unidade();
            unidade2.setBloco("A");
            unidade2.setNumeroApto("102");
            unidade2.setAndar(1);

            Unidade unidade3 = new Unidade();
            unidade3.setBloco("B");
            unidade3.setNumeroApto("201");
            unidade3.setAndar(1);

            unidadeRepository.saveAll(Arrays.asList(unidade1, unidade2, unidade3));
        }

        if (porteiroRepository.count() == 0) {
            System.out.println("Criando porteiro padrão...");

            Porteiro porteiro1 = new Porteiro();
            porteiro1.setNome("Leanderson");
            porteiro1.setCpf("12345678901");
            porteiro1.setEmail("leanderson.porteirogames@email.com");
            porteiro1.setSenhaHash(passwordEncoder.encode("EuSouOPorteiro123"));
            porteiro1.setDataNascimento(java.time.LocalDate.of(1976, 5, 25));
            porteiro1.setTipoUsuario(TipoUsuario.PORTEIRO);
            porteiro1.setDataEntrada(java.time.LocalDate.now());
            porteiro1.setMatricula("PORT-001");

            Porteiro porteiro2 = new Porteiro();
            porteiro2.setNome("Francisco");
            porteiro2.setCpf("98765432109");
            porteiro2.setEmail("franciscolimpalobbyportaria123@email.com");
            porteiro2.setSenhaHash(passwordEncoder.encode("PorteiroFranciscoLegal123"));
            porteiro2.setDataNascimento(java.time.LocalDate.of(1981, 6, 27));
            porteiro2.setTipoUsuario(TipoUsuario.PORTEIRO);
            porteiro2.setDataEntrada(java.time.LocalDate.now());
            porteiro2.setMatricula("PORT-002");

            porteiroRepository.saveAll(Arrays.asList(porteiro1, porteiro2));
        }

        // --- CRIA O SÍNDICO PADRÃO ---
        if (sindicoRepository.count() == 0) {
            System.out.println("Criando síndico padrão...");

            Usuario usuarioSindico = usuarioRepository.findByEmail("sindico@condominio.com").orElse(null);

            if (usuarioSindico == null) {
                usuarioSindico = usuarioRepository.findByEmail("sergio.augusto123@condominio.com").orElse(null);
            }

            if (usuarioSindico == null) {
                usuarioSindico = new Usuario();

                usuarioSindico.setNome("Administrador Síndico");
                usuarioSindico.setCpf("00011122233");
                usuarioSindico.setEmail("sindico@condominio.com");
                usuarioSindico.setSenhaHash(passwordEncoder.encode("Sindico123"));
                usuarioSindico.setDataNascimento(java.time.LocalDate.of(1990, 1, 15));
                usuarioSindico.setTipoUsuario(TipoUsuario.SINDICO);
                usuarioRepository.save(usuarioSindico);
            } else {
                if (usuarioSindico.getTipoUsuario() != TipoUsuario.SINDICO) {
                    usuarioSindico.setTipoUsuario(TipoUsuario.SINDICO);
                    usuarioRepository.save(usuarioSindico);
                }
            }

            Sindico sindico = new Sindico();

            sindico.setUsuario(usuarioSindico);
            sindico.setDataInicioMandato(java.time.LocalDate.now());
            sindico.setStatus("ATIVO");

            sindicoRepository.save(sindico);
        }

        // --- CRIA AS ÁREAS DE LAZER ---
        if (areaLazerRepository.count() == 0) {
            log.info("Criando áreas de lazer padrão...");

            AreaLazer churrasqueira = new AreaLazer();
            churrasqueira.setNome("Churrasqueira");
            churrasqueira.setCapacidadeMaxima(50);
            churrasqueira.setPrecisaPagar(true);
            churrasqueira.setValor(80.0);

            AreaLazer salaoFestas = new AreaLazer();
            salaoFestas.setNome("Salão de Festas");
            salaoFestas.setCapacidadeMaxima(100);
            salaoFestas.setPrecisaPagar(true);
            salaoFestas.setValor(120.0);

            AreaLazer salaoGourmet = new AreaLazer();
            salaoGourmet.setNome("Salão Gourmet");
            salaoGourmet.setCapacidadeMaxima(30);
            salaoGourmet.setPrecisaPagar(true);
            salaoGourmet.setValor(95.0);

            AreaLazer cinema = new AreaLazer();
            cinema.setNome("Cinema");
            cinema.setCapacidadeMaxima(15);
            cinema.setPrecisaPagar(true);
            cinema.setValor(70.0);

            AreaLazer sauna = new AreaLazer();
            sauna.setNome("Sauna");
            sauna.setCapacidadeMaxima(10);
            sauna.setPrecisaPagar(true);
            sauna.setValor(40.0);

            AreaLazer hidromassagem = new AreaLazer();
            hidromassagem.setNome("Hidromassagem");
            hidromassagem.setCapacidadeMaxima(8);
            hidromassagem.setPrecisaPagar(true);
            hidromassagem.setValor(50.0);

            areaLazerRepository.saveAll(Arrays.asList(
                    churrasqueira, salaoFestas, salaoGourmet, cinema, sauna, hidromassagem
            ));
        }

        log.info("Banco de dados populado e pronto para uso!");
    }

    // --- MÉTODO PARA CORRIGIR SENHAS ---
    private void corrigirSenhasEmTextoPuro() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        int corrigidos = 0;

        for (Usuario usuario : usuarios) {
            String senhaAtual = usuario.getPassword();

            if (senhaAtual != null && !senhaAtual.startsWith("$2a$")) {
                usuario.setSenhaHash(passwordEncoder.encode(senhaAtual));
                usuarioRepository.save(usuario);
                corrigidos++;
                log.info("Senha corrigida para: {}", usuario.getEmail());
            }
        }

        if (corrigidos > 0) {
            log.info("{} senha(s) em texto puro foram criptografadas com BCrypt.", corrigidos);
        } else {
            System.out.println("Todas as senhas já estão criptografadas.");
        }
    }
}
