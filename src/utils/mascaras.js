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

export const mascaraTelefone = (valor) =>
    somenteDigitos(valor, 11)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

export const mascaraCep = (valor) =>
    somenteDigitos(valor, 8)
        .replace(/(\d{5})(\d{1,3})$/, "$1-$2");

export const mascaraData = (valor) =>
    somenteDigitos(valor, 8)
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d{1,4})$/, "$1/$2");

export const mascaraMoeda = (valor) => {
    const digitos = somenteDigitos(valor);
    if (!digitos) return "";
    return (Number(digitos) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
};
