package com.condominio.modules.morador.rest;

import com.condominio.modules.morador.dto.MoradorRequestDTO;
import com.condominio.modules.morador.dto.MoradorResponseDTO;
import com.condominio.modules.morador.service.MoradorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/moradores")
public class MoradorController {
}
