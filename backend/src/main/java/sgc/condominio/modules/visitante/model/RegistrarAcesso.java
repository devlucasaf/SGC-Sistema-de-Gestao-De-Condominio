package sgc.condominio.modules.visitante.model;

import sgc.condominio.modules.porteiro.model.Porteiro;

import sgc.condominio.modules.unidade.model.Unidade;

import lombok.Data;

import javax.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "registro_acesso")
@Data
public class RegistrarAcesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_visitante")
    private Visitante visitante;

    @ManyToOne
    @JoinColumn(name = "id_porteiro", nullable = false)
    private Porteiro porteiroEntrada;

    private LocalDateTime dataHoraEntrada;
    private LocalDateTime dataHoraSaida;

    @ManyToOne
    @JoinColumn(name = "id_unidade")
    private Unidade unidade;

    public RegistrarAcesso() {
        this.dataHoraEntrada = LocalDateTime.now();
    }

}
