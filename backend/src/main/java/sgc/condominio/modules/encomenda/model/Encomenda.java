package sgc.condominio.modules.encomenda.model;

import sgc.condominio.modules.porteiro.model.Porteiro;
import sgc.condominio.modules.unidade.model.Unidade;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "encomenda")
@Data
public class Encomenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEncomenda status;

    @Column(name = "data_recebimento", nullable = false)
    private LocalDateTime dataRecebimento;

    @Column(name = "data_retirada")
    private LocalDateTime dataRetirada;

    @ManyToOne
    @JoinColumn(name = "id_unidade", nullable = false)
    private Unidade unidade;

    @ManyToOne
    @JoinColumn(name = "id_porteiro_recebeu", nullable = false)
    private Porteiro porteiroRecebeu;

    public Encomenda() {
        // --- CONSTRUTOR PADRÃO PARA JPA ---
    }

    // --- CONSTRUTOR ---
    public Encomenda(String descricao, Unidade unidade, Porteiro porteiro) {
        this.descricao = descricao;
        this.unidade = unidade;
        this.porteiroRecebeu = porteiro;
        this.status = StatusEncomenda.AGUARDANDO_RETIRADA;
        this.dataRecebimento = LocalDateTime.now();
    }
}
