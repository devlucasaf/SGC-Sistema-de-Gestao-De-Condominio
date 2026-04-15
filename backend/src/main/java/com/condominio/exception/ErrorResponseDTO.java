package com.condominio.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ErrorResponseDTO {
    private LocalDateTime   timestamp;
    private int             status;
    private String          error;
    private List<String>    messages;
}