import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// --- FLAG PARA EVITAR MÚLTIPLOS REFRESHES SIMULTÂNEOS ---
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

// --- INTERCEPTOR DE REQUEST: ADICIONA TOKEN ---
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// --- INTERCEPTOR DE RESPONSE: AUTO-REFRESH TOKEN ---
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || "";

        // --- SE FOI 401 E NÃO É A ROTA DE LOGIN/REFRESH ---
        if (
            error.response?.status === 401 &&
            !url.includes("/auth/login") &&
            !url.includes("/auth/refresh") &&
            !originalRequest._retry
        ) {
            // --- TENTA RENOVAR O TOKEN COM O REFRESH TOKEN ---
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                if (isRefreshing) {
                    // --- SE JÁ ESTÁ RENOVANDO, COLOCA NA FILA ---
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    }).catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const res = await axios.post("http://localhost:8080/auth/refresh", {
                        refreshToken: refreshToken,
                    });

                    const novoToken = res.data.token;
                    const novoRefreshToken = res.data.refreshToken;

                    localStorage.setItem("token", novoToken);
                    localStorage.setItem("refreshToken", novoRefreshToken);

                    api.defaults.headers.Authorization = `Bearer ${novoToken}`;
                    originalRequest.headers.Authorization = `Bearer ${novoToken}`;

                    processQueue(null, novoToken);

                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);

                    // --- REFRESH FALHOU: LIMPA E REDIRECIONA ---
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("perfilUsuario");

                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // --- SEM REFRESH TOKEN: REDIRECIONA ---
                localStorage.removeItem("token");
                localStorage.removeItem("perfilUsuario");

                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }

        // --- PARA 403 OU OUTROS ERROS DE AUTH SEM REFRESH ---
        if (error.response?.status === 403) {
            if (!url.includes("/auth/login")) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("perfilUsuario");

                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
