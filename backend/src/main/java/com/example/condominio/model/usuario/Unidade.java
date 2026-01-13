package com.example.condominio.model.usuario;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "unidade")
public class Unidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidade")
    private Long id;

    @Column(name = "bloco", nullable = false, length = 10)
    private String bloco;

    @Column(name = "numero", nullable = false, length = 10)
    private String numero;

    @Column(name = "andar")
    private Integer andar;

    @Column(name = "area_metro_quadrado")
    private Double areaMetroQuadrado;

    @Column(name = "quartos")
    private Integer quartos;

    @Column(name = "vagas_garagem")
    private Integer vagasGaragem;

    @Column(name = "vagas_garagem_numero", length = 100)
    private String vagasGaragemNumero;

    @Column(name = "fracao_ideal")
    private Double fracaoIdeal;

    @Column(name = "observacoes", length = 500)
    private String observacoes;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "unidade", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Morador> moradores = new HashSet<>();

    public Unidade() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Unidade(String bloco, String numero) {
        this();
        this.bloco = bloco;
        this.numero = numero;
        this.ativo = true;
    }

    // Métodos de ciclo de vida
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getIdentificacao() {
        return bloco + "-" + numero;
    }

    public String getIdentificacaoCompleta() {
        return "Apto " + bloco + "-" + numero;
    }

    public Integer getQuantidadeMoradores() {
        return moradores != null ? moradores.size() : 0;
    }

    public Integer getQuantidadeMoradoresAtivos() {
        if (moradores == null) return 0;
        return (int) moradores.stream()
                .filter(m -> m.isAtivo())
                .count();
    }

    public boolean temVagaGaragem() {
        return vagasGaragem > 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBloco() {
        return bloco;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Integer getAndar() {
        return andar;
    }

    public void setAndar(Integer andar) {
        this.andar = andar;
    }

    public Double getAreaM2() {
        return areaMetroQuadrado;
    }

    public void setAreaM2(Double areaMetroQuadrado) {
        this.areaMetroQuadrado = areaMetroQuadrado;
    }

    public Integer getQuartos() {
        return quartos;
    }

    public void setQuartos(Integer quartos) {
        this.quartos = quartos;
    }

    public Integer getVagasGaragem() {
        return vagasGaragem;
    }

    public void setVagasGaragem(Integer vagasGaragem) {
        this.vagasGaragem = vagasGaragem;
    }

    public String getVagasGaragemNumeros() {
        return vagasGaragemNumero;
    }

    public void setVagasGaragemNumeros(String vagasGaragemNumero) {
        this.vagasGaragemNumero = vagasGaragemNumero;
    }

    public Double getFracaoIdeal() {
        return fracaoIdeal;
    }

    public void setFracaoIdeal(Double fracaoIdeal) {
        this.fracaoIdeal = fracaoIdeal;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<Morador> getMoradores() {
        return moradores;
    }

    public void setMoradores(Set<Morador> moradores) {
        this.moradores = moradores;
    }

    public void adicionarMorador(Morador morador) {
        if (moradores == null) {
            moradores = new HashSet<>();
        }
        moradores.add(morador);
        morador.setUnidade(this);
    }

    @Override
    public String toString() {
        return "Unidade{" +
                "id=" + id +
                ", identificacao='" + getIdentificacaoCompleta() + '\'' +
                ", ativo=" + ativo +
                ", moradores=" + getQuantidadeMoradoresAtivos() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Unidade unidade = (Unidade) o;

        if (bloco != null ? !bloco.equals(unidade.bloco) : unidade.bloco != null) return false;
        return numero != null ? numero.equals(unidade.numero) : unidade.numero == null;
    }

    @Override
    public int hashCode() {
        int result = bloco != null ? bloco.hashCode() : 0;
        result = 31 * result + (numero != null ? numero.hashCode() : 0);
        return result;
    }
}
