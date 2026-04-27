import { Navigate } from "react-router-dom";

function RotaPrivada({ children }) {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    // --- VERIFICA SE O TOKEN EXISTE ---
    if (!token && !refreshToken) {
        return <Navigate to="/login" />;
    }

    // --- SE NÃO TEM ACCESS TOKEN MAS TEM REFRESH, DEIXA PASSAR (O INTERCEPTOR DO AXIOS VAI RENOVAR) ---
    if (!token && refreshToken) {
        return children;
    }

    // --- VERIFICA SE O TOKEN ESTÁ EXPIRADO ---
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const agora = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < agora) {
            // --- SE TEM REFRESH TOKEN, DEIXA O INTERCEPTOR RENOVAR ---
            if (refreshToken) {
                return children;
            }
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("perfilUsuario");
            return <Navigate to="/login" />;
        }
    } catch (e) {
        // --- TOKEN INVÁLIDO ---
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("perfilUsuario");
        return <Navigate to="/login" />;
    }

    return children;
}

export default RotaPrivada;
