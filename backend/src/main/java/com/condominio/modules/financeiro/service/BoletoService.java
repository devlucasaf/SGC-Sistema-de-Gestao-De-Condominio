package com.condominio.modules.financeiro.service;

import com.condominio.modules.financeiro.dto.AlterarVencimentoDTO;
import com.condominio.modules.financeiro.model.Boleto;
import com.condominio.modules.financeiro.repository.BoletoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BoletoService {

    @Autowired
    private BoletoRepository boletoRepository;

    @Transactional
    public void prorrogarVencimento(Long idBoleto, AlterarVencimentoDTO dto) {
        // 1. Busca o boleto no banco
        Boleto boleto = boletoRepository.findById(idBoleto)
                .orElseThrow(() -> new RuntimeException("Boleto não encontrado."));

        // 2. Regra de Negócio: Não pode alterar data de boleto PAGO ou CANCELADO
        if ("PAGO".equals(boleto.getStatus())) {
            throw new RuntimeException("Não é possível alterar o vencimento de um boleto já pago.");
        }
        if ("CANCELADO".equals(boleto.getStatus())) {
            throw new RuntimeException("Não é possível alterar o vencimento de um boleto cancelado.");
        }

        // 3. Atualiza a data
        boleto.setDataVencimento(dto.getNovaDataVencimento());

        // Se o boleto estava "VENCIDO" e a nova data é no futuro, ele volta a ficar "PENDENTE"
        boleto.setStatus("PENDENTE");

        // 4. Salva no banco de dados
        boletoRepository.save(boleto);
    }
}