// Remove tudo que não é número e (opcionalmente) limita a quantidade de dígitos.
export const somenteDigitos = (valor, max) => {
    const digitos = (valor || "").replace(/\D/g, "");
    return max ? digitos.slice(0, max) : digitos;
};

export const mascaraCpf = (valor) =>
    somenteDigitos(valor, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const mascaraRg = (valor) =>
    somenteDigitos(valor, 9)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)$/, "$1-$2");

// Aceita fixo (10 dígitos: (11) 1234-5678) e celular (11 dígitos: (11) 91234-5678).
export const mascaraTelefone = (valor) => {
    const digitos = somenteDigitos(valor, 11);

    if (digitos.length <= 2) return digitos;
    if (digitos.length <= 6) return digitos.replace(/(\d{2})(\d+)/, "($1) $2");
    if (digitos.length <= 10) return digitos.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    return digitos.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

export const mascaraCep = (valor) =>
    somenteDigitos(valor, 8)
        .replace(/(\d{5})(\d{1,3})$/, "$1-$2");

export const mascaraData = (valor) =>
    somenteDigitos(valor, 8)
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d{1,4})$/, "$1/$2");
