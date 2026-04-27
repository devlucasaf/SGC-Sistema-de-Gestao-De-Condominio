package com.condominio.modules.admin.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AdminDashboardDTO {
    private long totalUsuarios;
    private long totalMoradores;
    private long totalSindicos;
    private long totalPorteiros;
    private long totalUnidades;
    private long totalReservas;
    private long totalReclamacoes;
    private long totalManutencoes;
}

