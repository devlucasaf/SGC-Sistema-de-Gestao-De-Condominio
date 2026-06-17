package sgc.condominio.modules.financeiro.scheduler;

import sgc.condominio.modules.financeiro.model.Boleto;
import sgc.condominio.modules.financeiro.repository.BoletoRepository;
import sgc.condominio.modules.morador.model.Morador;
import sgc.condominio.modules.morador.model.StatusMorador;
import sgc.condominio.modules.morador.model.TipoMorador;
import sgc.condominio.modules.morador.repository.MoradorRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@Component
public class BoletoScheduler {

    private static final Logger log = LoggerFactory.getLogger(BoletoScheduler.class);

    private static final BigDecimal VALOR_CONDOMINIO = new BigDecimal("450.00");

    private static final int DIA_VENCIMENTO = 10;

    @Autowired
    private BoletoRepository boletoRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    @Scheduled(cron = "0 0 6 1 * *")
    @Transactional
    public void gerarBoletosMensais() {
        log.info("Iniciando geração de boletos mensais...");

        LocalDate hoje = LocalDate.now();
        String mesReferencia = gerarDescricaoMes(hoje);
        LocalDate dataVencimento = hoje.withDayOfMonth(DIA_VENCIMENTO);

        if (dataVencimento.isBefore(hoje)) {
            dataVencimento = hoje.plusMonths(1).withDayOfMonth(DIA_VENCIMENTO);
        }

        // --- BUSCA APENAS PROPRIETÁRIOS E INQUILINOS ATIVOS ---
        List<TipoMorador> tiposResponsaveis = Arrays.asList(
                TipoMorador.PROPRIETARIO,
                TipoMorador.INQUILINO
        );

        List<StatusMorador> statusPermitidos = Arrays.asList(
                StatusMorador.ATIVO,
                StatusMorador.INADIMPLENTE
        );

        List<Morador> responsaveis = moradorRepository.findResponsaveisFinanceirosAtivos(
                tiposResponsaveis, statusPermitidos
        );

        log.info("Encontrados {} moradores responsáveis financeiros.", responsaveis.size());

        // --- CONTROLE DE GERAÇÃO DE BOLETO ---
        Set<Long> unidadesJaGeradas = new HashSet<>();
        int boletosGerados = 0;
        int boletosPulados = 0;

        for (Morador morador : responsaveis) {
            Long idUnidade = morador.getUnidade().getId();

            if (unidadesJaGeradas.contains(idUnidade)) {
                boletosPulados++;
                continue;
            }

            if (boletoRepository.existsByMoradorIdAndDescricao(morador.getId(), mesReferencia)) {
                log.info("Boleto já existe para {} (ID: {}) - mês: {}", morador.getNome(), morador.getId(), mesReferencia);
                unidadesJaGeradas.add(idUnidade);
                boletosPulados++;
                continue;
            }

            // --- GERA O BOLETO ---
            Boleto boleto = new Boleto();

            boleto.setDescricao(mesReferencia);
            boleto.setValor(VALOR_CONDOMINIO);
            boleto.setDataVencimento(dataVencimento);
            boleto.setMorador(morador);
            boleto.setStatus("PENDENTE");
            boleto.setUrlBoleto("https://www.boletobancario-codigodebarras.com/img/boleto-exemplo.png");

            boletoRepository.save(boleto);
            unidadesJaGeradas.add(idUnidade);
            boletosGerados++;

            log.info("Boleto gerado: {} | {} | Unidade: {} | Venc: {}",
                    morador.getNome(), mesReferencia,
                    morador.getUnidade().getBloco() + "-" + morador.getUnidade().getNumeroApto(),
                    dataVencimento);
        }

        log.info("========== RESUMO ==========");
        log.info("Boletos gerados: {}", boletosGerados);
        log.info("Boletos pulados (já existiam ou unidade repetida): {}", boletosPulados);
        log.info("========== FIM DA GERAÇÃO ==========");
    }

    private String gerarDescricaoMes(LocalDate data) {
        String nomeMes = data.getMonth().getDisplayName(TextStyle.FULL, new Locale("pt", "BR"));
        nomeMes = nomeMes.substring(0, 1).toUpperCase() + nomeMes.substring(1);
        return "Condomínio - " + nomeMes + "/" + data.getYear();
    }
}

