import { API_BASE_URL } from "../services/apiClient";

export function montarUrlFoto(caminho) {
    if (!caminho) return null;

    return `${API_BASE_URL}${caminho}`;
}
