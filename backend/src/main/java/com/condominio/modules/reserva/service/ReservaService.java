package com.condominio.modules.reserva.service;

import com.condominio.modules.morador.model.Morador;
import com.condominio.modules.reserva.dto.ReservaRequestDTO;
import com.condominio.modules.reserva.model.AreaLazer;
import com.condominio.modules.reserva.model.Reserva;
import com.condominio.modules.reserva.model.StatusReserva;
import com.condominio.modules.reserva.repository.AreaLazerRepository;
import com.condominio.modules.reserva.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private AreaLazerRepository areaLazerRepository;

    @Transactional
    public Reserva reservar(ReservaRequestDTO dto, Morador moradorLogado) {

        // --- VERIFICAR SE A ÁREA DE LAZER EXISTE ---
        AreaLazer area = areaLazerRepository.findById(dto.getIdAreaLazer())
                .orElseThrow(() -> new RuntimeException("Área de lazer não encontrada."));

        // --- VERIFICA SE EXISTE RESERVA PARA ESSA ÁREA NESSA DATA ---
        Optional<Reserva> reservaExistente = reservaRepository
                .findByAreaLazerIdAndDataReservaAndStatusNot(
                        dto.getIdAreaLazer(),
                        dto.getDataReserva(),
                        StatusReserva.CANCELADA
                );

        if (reservaExistente.isPresent()) {
            throw new RuntimeException("Esta área já está reservada para o dia selecionado!");
        }

        // --- CRIAMOS A RESERVA ---
        Reserva novaReserva = new Reserva();

        novaReserva.setAreaLazer(area);
        novaReserva.setMorador(moradorLogado);
        novaReserva.setDataReserva(dto.getDataReserva());
        novaReserva.setStatus(StatusReserva.APROVADA);

        return reservaRepository.save(novaReserva);
    }

    @Transactional
    public void cancelar(Long idReserva, Long idMoradorLogado) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada."));

        if (!reserva.getMorador().getId().equals(idMoradorLogado)) {
            throw new RuntimeException("Você não tem permissão para cancelar esta reserva.");
        }

        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);
    }
}