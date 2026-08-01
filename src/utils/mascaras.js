export const mascaraCpf = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return valor;
};

export const mascaraRg = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 9);

    valor = valor.replace(/(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,1})$/, "$1-$2");

    return valor;
};

export const mascaraTelefone = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{5})(\d{1,4})$/, "$1-$2");

    return valor;
};

export const mascaraCep = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 8);
    valor = valor.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
    return valor;
};

export const mascaraData = (valor) => {
    valor = valor.replace(/\D/g, "").slice(0, 8);
    valor = valor.replace(/(\d{2})(\d)/, "$1/$2");
    valor = valor.replace(/(\d{2})(\d{1,4})$/, "$1/$2");
    return valor;
};

export const mascaraMoeda = (valor) => {
    valor = valor.replace(/\D/g, "");
    if (!valor) return "";
    valor = (Number(valor) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    return valor;
};
