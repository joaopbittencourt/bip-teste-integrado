package br.com.bipteste.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.math.BigInteger;

@Entity(name = "BENEFICIO")
public class Beneficio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private BigInteger id;
    @Column(name = "NOME")
    private String nome;
    @Column(name = "DESCRICAO")
    private String  descricao;
    @Column(name = "VALOR")
    private BigDecimal valor;
    @Column(name = "ATIVO")
    private boolean ativo;
    @Column(name = "VERSION")
    private BigInteger version;

    public BigInteger getId() {
        return id;
    }

    public void setId(BigInteger id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public BigInteger getVersion() {
        return version;
    }

    public void setVersion(BigInteger version) {
        this.version = version;
    }
}
