package com.condominio.web.bean.comum;

import com.condominio.entity.Login;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.jsf.FacesContextUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;


@Getter
@Setter

public class Sessao implements Serializable {
    private Login login;
    private String mensagemTelaLogin;
}
