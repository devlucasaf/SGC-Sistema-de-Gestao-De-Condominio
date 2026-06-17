package sgc.condominio.modules.votacao.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "votos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"votacao_id", "morador_id"})
})
@Data
public class Voto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "votacao_id", nullable = false)
    private Votacao votacao;

    @Column(name = "morador_id", nullable = false)
    private Long moradorId;

    @Column(nullable = false)
    private String candidato;

    private String unidade;

    private LocalDateTime dataVoto = LocalDateTime.now();
}

