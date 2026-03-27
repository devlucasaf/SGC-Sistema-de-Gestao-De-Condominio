package com.condominio.infra.config;

import com.condominio.modules.porteiro.model.Porteiro;
import com.condominio.modules.porteiro.repository.PorteiroRepository;
import com.condominio.modules.unidade.model.Unidade;
import com.condominio.modules.unidade.repository.UnidadeRepository;
import com.condominio.modules.usuario.model.TipoUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private PorteiroRepository porteiroRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Iniciando o Data Seeder... Verificando o banco de dados...");

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
            porteiro1.setSenhaHash("EuSouOPorteiro123");
            porteiro1.setDataNascimento(java.time.LocalDate.of(1976, 5, 25));
            porteiro1.setTipoUsuario(TipoUsuario.PORTEIRO);
            porteiro1.setDataEntrada(java.time.LocalDate.now());
            porteiro1.setMatricula("PORT-001");

            Porteiro porteiro2 = new Porteiro();
            porteiro2.setNome("Francisco");
            porteiro2.setCpf("98765432109");
            porteiro2.setEmail("franciscolimpalobbyportaria123@email.com");
            porteiro2.setSenhaHash("PorteiroFranciscoLegal123");
            porteiro2.setDataNascimento(java.time.LocalDate.of(1981, 6, 27));
            porteiro2.setTipoUsuario(TipoUsuario.PORTEIRO);
            porteiro2.setDataEntrada(java.time.LocalDate.now());
            porteiro2.setMatricula("PORT-002");

            porteiroRepository.saveAll(Arrays.asList(porteiro1, porteiro2));
        }

        System.out.println("Banco de dados populado e pronto para uso!");
    }
}
