import { somenteDigitos } from "../utils/mascaras";
import api from "./apiClient";

export async function buscarEnderecoPorCep(cep) {
    const cepLimpo = somenteDigitos(cep);
    if (cepLimpo.length !== 8) return null;

    try {
        const response = await api.get(`/cep/${cepLimpo}`);
        if (response.status !== 200) return null;
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        return null;
    }
}
