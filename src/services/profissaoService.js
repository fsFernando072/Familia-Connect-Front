import api from "./apiClient";

export async function buscarProfissoes() {
    try {
        const response = await api.get("/profissoes");

        if (response.status === 200) return response.data;
        return [];
    } catch (error) {
        console.error("Erro ao buscar profissões:", error);
        return [];
    }
}
