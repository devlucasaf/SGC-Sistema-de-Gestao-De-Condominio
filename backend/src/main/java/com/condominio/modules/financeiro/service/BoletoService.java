package com.condominio.modules.financeiro.service;

import com.condominio.modules.financeiro.dto.AlterarVencimentoDTO;
import com.condominio.modules.financeiro.dto.BoletoRequestDTO;
import com.condominio.modules.financeiro.model.Boleto;
import com.condominio.modules.financeiro.repository.BoletoRepository;

import com.condominio.modules.morador.model.Morador;
import com.condominio.modules.morador.repository.MoradorRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class BoletoService {

    @Autowired
    private BoletoRepository boletoRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    @Transactional
    public void prorrogarVencimento(Long idBoleto, AlterarVencimentoDTO dto) {
        // --- BUSCA O BOLETO NO BANCO DE DADOS ---
        Boleto boleto = boletoRepository.findById(idBoleto)
                .orElseThrow(() -> new RuntimeException("Boleto não encontrado."));

        if ("PAGO".equals(boleto.getStatus())) {
            throw new RuntimeException("Não é possível alterar o vencimento de um boleto já pago.");
        }

        if ("CANCELADO".equals(boleto.getStatus())) {
            throw new RuntimeException("Não é possível alterar o vencimento de um boleto cancelado.");
        }

        // --- ATUALIZA A DATA ---
        boleto.setDataVencimento(dto.getNovaDataVencimento());

        boleto.setStatus("PENDENTE");

        // --- SALVA NO BANCO DE DADOS ---
        boletoRepository.save(boleto);
    }

    @Transactional
    public void gerarBoleto(BoletoRequestDTO dto) {
        Morador morador = moradorRepository.findById(dto.getIdMorador())
                .orElseThrow(() -> new RuntimeException("Morador não encontrado."));

        Boleto novoBoleto = new Boleto();

        novoBoleto.setDescricao(dto.getDescricao());
        novoBoleto.setValor(dto.getValor());
        novoBoleto.setDataVencimento(dto.getDataVencimento());
        novoBoleto.setMorador(morador);
        novoBoleto.setStatus("PENDENTE");

        novoBoleto.setUrlBoleto("https://www.boletobancario-codigodebarras.com/img/boleto-exemplo.png");

        boletoRepository.save(novoBoleto);
    }
}
