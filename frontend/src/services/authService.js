import { api } from "./api";

export const authService = {
    login: async (email, senha) => {
        const response = await api.post("/api/auth/login", { email, senha });
        return response.data;
    },

    cadastrar: async (dadosCadastro) => {
        const response = await api.post("/api/auth/register", dadosCadastro);
        return response.data;
    }
};
