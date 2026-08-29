import api from "./apiClient";

export const TAMANHO_MAXIMO_ARQUIVO_MB = 1;
export const LIMITE_IMPORTACOES_POR_HORA = 60;

const TAMANHO_MAXIMO_ARQUIVO_BYTES = TAMANHO_MAXIMO_ARQUIVO_MB * 1024 * 1024;

export function validarTamanhoArquivo(arquivo) {
    return !!arquivo && arquivo.size <= TAMANHO_MAXIMO_ARQUIVO_BYTES;
}

export async function extrairDadosFamiliaPorFoto(arquivo) {
    if (!validarTamanhoArquivo(arquivo)) {
        return { sucesso: false, erro: `A foto deve ter no máximo ${TAMANHO_MAXIMO_ARQUIVO_MB}MB.` };
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    try {
        const response = await api.post("/ocr", formData);

        if (response.status === 200) return { sucesso: true, dados: response.data };

        if (response.status === 429) {
            return { sucesso: false, erro: `Limite de ${LIMITE_IMPORTACOES_POR_HORA} fotos por hora atingido. Tente novamente mais tarde.` };
        }
        if (response.status === 413) {
            return { sucesso: false, erro: `A foto deve ter no máximo ${TAMANHO_MAXIMO_ARQUIVO_MB}MB.` };
        }
        if (response.status === 400 || response.status === 415 || response.status === 422) {
            return { sucesso: false, erro: "Não foi possível extrair os dados dessa foto. Tente outra imagem." };
        }
        return { sucesso: false, erro: "Não foi possível processar a foto." };
    } catch (error) {
        console.error("Erro ao extrair dados da família via OCR:", error);
        return { sucesso: false, erro: "Erro de conexão ao processar a foto." };
    }
}
