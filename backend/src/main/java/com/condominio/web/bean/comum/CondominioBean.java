package com.condominio.web.bean.comum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CondominioBean {

    private transient Sessao sessao;
    public boolean podeIniciar() {
        if (sessao.getLogin() == null) {
            sessao.setMensagemTelaLogin("");
            irParaLogin();
            return false;
        } else if (Strings.isNullOrEmpty) {

        }
    }
}
