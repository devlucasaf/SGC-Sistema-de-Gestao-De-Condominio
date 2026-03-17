package com.condominio.modules.financeiro.dto;

import lombok.Data;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class AlterarVencimentoDTO {

    @NotNull(message = "A nova data de vencimento é obrigatória.")
    @Future(message = "A nova data de vencimento deve ser no futuro.")
    private LocalDate novaDataVencimento;
}
