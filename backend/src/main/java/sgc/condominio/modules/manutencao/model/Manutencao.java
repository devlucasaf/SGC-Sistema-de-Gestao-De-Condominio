package sgc.condominio.modules.manutencao.model;

import sgc.condominio.modules.sindico.model.Sindico;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "manutencao")
@Data
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(length = 500)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoManutencao tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusManutencao status;

    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_fim")
    private LocalDateTime dataFim;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @ManyToOne
    @JoinColumn(name = "id_sindico", nullable = false)
    private Sindico sindico;

    public Manutencao() {
        this.dataCriacao = LocalDateTime.now();
        this.status = StatusManutencao.AGENDADA;
    }
}

