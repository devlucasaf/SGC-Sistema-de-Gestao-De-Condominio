package com.condominio.service;

import com.condominio.model.usuario.Morador;
import com.condominio.model.usuario.Funcionario;
import com.condominio.model.usuario.Sindico;
import com.condominio.model.usuario.Porteiro;
import com.condominio.repository.MoradorRepository;
import com.condominio.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Morador morador = moradorRepository.findByEmail(username);
        if (morador != null) {
            return buildUserDetails(morador.getEmail(), morador.getSenhaHash(),
                    getMoradorAuthorities(morador), morador);
        }

        Funcionario funcionario = funcionarioRepository.findByEmailCorporativo(username);
        if (funcionario != null) {
            return buildUserDetails(funcionario.getEmailCorporativo(), funcionario.getSenhaHash(),
                    getFuncionarioAuthorities(funcionario), funcionario);
        }

        throw new UsernameNotFoundException("Usuário não encontrado com email: " + username);
    }

    @Transactional
    public UserDetails loadUserByUsernameAndType(String username, String userType) {
        if ("MORADOR".equalsIgnoreCase(userType)) {
            Morador morador = moradorRepository.findByEmail(username);
            if (morador != null) {
                return buildUserDetails(morador.getEmail(), morador.getSenhaHash(),
                        getMoradorAuthorities(morador), morador);
            }
        } else if ("FUNCIONARIO".equalsIgnoreCase(userType) ||
                "PORTEIRO".equalsIgnoreCase(userType) ||
                "SINDICO".equalsIgnoreCase(userType)) {
            Funcionario funcionario = funcionarioRepository.findByEmailCorporativo(username);
            if (funcionario != null) {
                return buildUserDetails(funcionario.getEmailCorporativo(), funcionario.getSenhaHash(),
                        getFuncionarioAuthorities(funcionario), funcionario);
            }
        }

        throw new UsernameNotFoundException("Usuário não encontrado: " + username + " do tipo: " + userType);
    }

    private List<GrantedAuthority> getMoradorAuthorities(Morador morador) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_MORADOR"));

        if (morador instanceof Sindico) {
            authorities.add(new SimpleGrantedAuthority("ROLE_SINDICO"));
            Sindico sindico = (Sindico) morador;

            if (sindico.getPermissoes() != null) {
                sindico.getPermissoes().forEach(permissao ->
                        authorities.add(new SimpleGrantedAuthority(permissao.name())));
            }
        }

        if (morador.getStatus() != null) {
            authorities.add(new SimpleGrantedAuthority("STATUS_" + morador.getStatus().name()));
        }

        return authorities;
    }

    private List<GrantedAuthority> getFuncionarioAuthorities(Funcionario funcionario) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        String role = "ROLE_" + funcionario.getCargo().name();
        authorities.add(new SimpleGrantedAuthority(role));

        if (funcionario instanceof Sindico) {
            authorities.add(new SimpleGrantedAuthority("ROLE_SINDICO"));
            Sindico sindico = (Sindico) funcionario;

            if (sindico.getPermissoes() != null) {
                sindico.getPermissoes().forEach(permissao ->
                        authorities.add(new SimpleGrantedAuthority(permissao.name())));
            }
        }

        if (funcionario instanceof Porteiro) {
            Porteiro porteiro = (Porteiro) funcionario;

            if (porteiro.getPermissoes() != null) {
                porteiro.getPermissoes().forEach(permissao ->
                        authorities.add(new SimpleGrantedAuthority(permissao.name())));
            }
        }

        if (funcionario.getStatus() != null) {
            authorities.add(new SimpleGrantedAuthority("STATUS_" + funcionario.getStatus().name()));
        }

        return authorities;
    }

    private UserDetails buildUserDetails(String username, String password,
                                         List<GrantedAuthority> authorities, Object userEntity) {
        return new CustomUserDetails(
                username,
                password,
                true,
                true,
                true,
                true,
                authorities,
                userEntity
        );
    }
}
