import api from "./apiClient";

export async function buscarEstados() {
    try {
        const response = await api.get("/estados");

        if (response.status === 200) return response.data;
        return [];
    } catch (error) {
        console.error("Erro ao buscar estados:", error);
        return [];
    }
}
