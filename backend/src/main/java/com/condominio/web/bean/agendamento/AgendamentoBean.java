package com.condominio.web.bean.agendamento;

import com.condominio.web.bean.agendamento.dto.AreaLazer;
import com.condominio.web.bean.agendamento.dto.DataReservada;
import com.condominio.web.bean.comum.PesquisarAreaLazer;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.service.spi.InjectService;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class AgendamentoBean implements Serializable {

    private transient AreaLazer lazer;
    private PesquisarAreaLazer pesquisarAreaLazer;

    private String nome;
    private String cpf;
    private String apartamento;
    private String email;
    private String orientacoes;

    private Date data;

    private Boolean opcoesAgendamento;

    private List<AreaLazer> areaLazerSelecionada;
    private List<DataReservada> dataReservadasSelecionada;
}
