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
    private String  tipoUsuario;
    private String  detalheExtra;

    public static UsuarioPerfilDTO fromEntity(Usuario usuario) {
        UsuarioPerfilDTO dto = new UsuarioPerfilDTO();
        
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());

        if (usuario instanceof Morador) {
            Morador m = (Morador) usuario;

            dto.setTipoUsuario("MORADOR");
            dto.setDetalheExtra("Apto: " + m.getUnidade().getNumeroApto() + " - Bloco: " + m.getUnidade().getBloco());
        }
        
        else if (usuario instanceof Porteiro) {
            Porteiro p = (Porteiro) usuario;

            dto.setTipoUsuario("PORTEIRO");
            dto.setDetalheExtra("Matrícula: " + p.getMatricula());
        }

        return dto;
    }
}