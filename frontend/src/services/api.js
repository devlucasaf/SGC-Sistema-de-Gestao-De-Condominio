import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// --- INTERCEPTOR DE REQUEST: ADICIONA TOKEN ---
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// --- INTERCEPTOR DE RESPONSE ---
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const url = error.config?.url || "";

            // --- NÃO REDIRECIONA SE FOR A ROTA DE LOGIN ---
            if (!url.includes("/auth/login")) {
                localStorage.removeItem("token");
                localStorage.removeItem("perfilUsuario");

                // --- REDIRECIONA PARA LOGIN ---
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
