import axios from "axios";

export async function buscarEnderecoPorCep(cep) {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return null;

    try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (data.erro) return null;
        return data;
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        return null;
    }
}
