package com.example.condominio.model.usuario;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sindico")
@PrimaryKeyJoinColumn(name = "id_morador")
public class Sindico extends Morador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sindico")
    private Long idSindico;

    @Column(name = "data_inicio_mandato")
    private LocalDate dataInicioMandato;

    @Column(name = "data_fim_mandato")
    private LocalDate dataFimMandato;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_mandato")
    private StatusMandato statusMandato;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sindico")
    private TipoSindico tipoSindico;

    @ElementCollection
    @CollectionTable(name = "sindico_permissoes",
            joinColumns = @JoinColumn(name = "id_sindico"))
    @Column(name = "permissao")
    @Enumerated(EnumType.STRING)
    private Set<PermissaoSindico> permissoes;

    public enum StatusMandato {
        ATIVO, FINALIZADO, INTERINO
    }

    public enum TipoSindico {
        TITULAR, SUPLENTE, INTERINO
    }

    public enum PermissaoSindico {
        CADASTRAR_MORADORES,
        APROVAR_CADASTROS,
        GERAR_BOLETOS,
        ENVIAR_COMUNICADOS,
        GERENCIAR_FUNCIONARIOS,
        GERAR_RELATORIOS,
        ADMINISTRAR_RESERVAS
    }

    // Getters e Setters
}