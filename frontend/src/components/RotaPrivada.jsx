import { Navigate } from "react-router-dom";

function RotaPrivada({ children }) {
    const token = localStorage.getItem("token");

    // --- VERIFICA SE O TOKEN EXISTE ---
    if (!token) {
        return <Navigate to="/login" />;
    }

    // --- VERIFICA SE O TOKEN ESTÁ EXPIRADO ---
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const agora = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < agora) {
            localStorage.removeItem("token");
            localStorage.removeItem("perfilUsuario");
            return <Navigate to="/login" />;
        }
    } catch (e) {
        // --- TOKEN INVÁLIDO ---
        localStorage.removeItem("token");
        localStorage.removeItem("perfilUsuario");
        return <Navigate to="/login" />;
    }

    return children;
}

export default RotaPrivada;
