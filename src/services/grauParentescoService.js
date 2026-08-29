import api from "./apiClient";

export async function buscarGrausParentesco() {
    try {
        const response = await api.get("/grau-parentescos");

        if (response.status === 200) return response.data;
        return [];
    } catch (error) {
        console.error("Erro ao buscar graus de parentesco:", error);
        return [];
    }
}
