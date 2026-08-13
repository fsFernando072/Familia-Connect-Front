import api from "./apiClient";

export async function buscarCargo() {
    try {
        const response = await api.get("/cargos");

        if (response.status === 200) {
            return response.data;
        }
        if (response.status === 204) {
            console.log("Usuário não encontrado");
            return [];
        }
        if (response.status === 401) {
            console.log("Não autorizado");
        }
        return null;
    } catch (error) {
        console.error("Erro:", error);
        return null;
    }
}
