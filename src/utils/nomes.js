// Nome da família = último sobrenome do responsável (ex: "Maria da Silva" -> "Silva").
export function obterUltimoSobrenome(nomeCompleto) {
    const partes = (nomeCompleto || "").trim().split(/\s+/).filter(Boolean);

    return partes.length ? partes[partes.length - 1] : "";
}
