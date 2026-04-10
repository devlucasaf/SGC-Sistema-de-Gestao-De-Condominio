package com.condominio.modules.usuario.dto;

import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.morador.model.Morador;
import com.condominio.modules.porteiro.model.Porteiro;

import lombok.Data;

@Data
public class UsuarioPerfilDTO {
    private Long    id;
    private String  nome;
    private String  email;
    private String  telefone;
    private String  cpf;
    private String  tipoUsuario;
    private String  detalheExtra;
    private Long    idUnidade;
    private String  numeroApto;
    private String  bloco;
    private Integer andar;
    private String  tipoMorador;
    private String  statusMorador;
    private String  dataEntrada;

    public static UsuarioPerfilDTO fromEntity(Usuario usuario) {
        UsuarioPerfilDTO dto = new UsuarioPerfilDTO();
        
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setTelefone(usuario.getTelefone());
        dto.setCpf(usuario.getCpf());

        dto.setTipoUsuario(usuario.getTipoUsuario().name());

        if (usuario instanceof Morador) {
            Morador m = (Morador) usuario;
            dto.setDetalheExtra("Apto: " + m.getUnidade().getNumeroApto() + " - Bloco: " + m.getUnidade().getBloco());
            dto.setIdUnidade(m.getUnidade().getId());
            dto.setNumeroApto(m.getUnidade().getNumeroApto());
            dto.setBloco(m.getUnidade().getBloco());
            dto.setAndar(m.getUnidade().getAndar());
            dto.setTipoMorador(m.getTipoMorador().getDescricao());
            dto.setStatusMorador(m.getStatus().getDescricao());
            dto.setDataEntrada(m.getDataEntrada() != null ? m.getDataEntrada().toString() : null);
        }
        
        else if (usuario instanceof Porteiro) {
            Porteiro p = (Porteiro) usuario;
            dto.setDetalheExtra("Matrícula: " + p.getMatricula());
        }

        else {
            dto.setDetalheExtra("Administração");
        }

        return dto;
    }
}