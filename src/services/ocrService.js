import api from "./apiClient";
import { mensagemDeErro } from "./servicoBase";

export const TAMANHO_MAXIMO_ARQUIVO_MB = 1;
export const LIMITE_IMPORTACOES_POR_HORA = 60;

const TAMANHO_MAXIMO_ARQUIVO_BYTES = TAMANHO_MAXIMO_ARQUIVO_MB * 1024 * 1024;

const MSG_FOTO_ILEGIVEL = "Não foi possível extrair os dados dessa foto. Tente outra imagem.";
const MSG_FOTO_GRANDE = `A foto deve ter no máximo ${TAMANHO_MAXIMO_ARQUIVO_MB}MB.`;

// Em 400/422 a mensagem do back-end (se houver) vem antes; estas valem como reserva.
const ERROS_OCR = {
    400: MSG_FOTO_ILEGIVEL,
    413: MSG_FOTO_GRANDE,
    415: MSG_FOTO_ILEGIVEL,
    422: MSG_FOTO_ILEGIVEL,
    429: `Limite de ${LIMITE_IMPORTACOES_POR_HORA} fotos por hora atingido. Tente novamente mais tarde.`,
};

export function validarTamanhoArquivo(arquivo) {
    return Boolean(arquivo) && arquivo.size <= TAMANHO_MAXIMO_ARQUIVO_BYTES;
}

export async function extrairDadosFamiliaPorFoto(arquivo) {
    if (!validarTamanhoArquivo(arquivo)) {
        return { sucesso: false, erro: MSG_FOTO_GRANDE };
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);

    try {
        const response = await api.post("/ocr", formData);

        if (response.status === 200) return { sucesso: true, dados: response.data };

        return { sucesso: false, erro: mensagemDeErro(response, ERROS_OCR, "Não foi possível processar a foto.") };
    } catch (error) {
        console.error("Erro ao extrair dados da família via OCR:", error);
        return { sucesso: false, erro: "Erro de conexão ao processar a foto." };
    }
}
