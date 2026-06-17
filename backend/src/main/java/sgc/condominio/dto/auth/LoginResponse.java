package sgc.condominio.dto.auth;

import java.util.List;

public class LoginResponse {
    private String       token;
    private String       tokenType = "Bearer";
    private String       username;
    private String       userType;
    private List<String> roles;

    public LoginResponse(String token, String username, String userType, List<String> roles) {
        this.token = token;
        this.username = username;
        this.userType = userType;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getUsername() {
        return username;
    }

    public String getUserType() {
        return userType;
    }

    public List<String> getRoles() {
        return roles;
    }
}
