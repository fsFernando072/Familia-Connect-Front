// Valida o CPF pelo algoritmo oficial de dígito verificador (mesma regra que o
// back-end aplica com @CPF do Hibernate Validator), evitando que um CPF inválido
// só seja descoberto quando o back-end já rejeitou a requisição.
export function validarCpf(cpf) {
    const cpfLimpo = (cpf || "").replace(/\D/g, "");

    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false; // ex: 111.111.111-11

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo[i], 10) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo[9], 10)) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo[i], 10) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo[10], 10)) return false;

    return true;
}

// O RG não tem um dígito verificador padrão nacional; o back-end só exige
// entre 7 e 9 caracteres (@Size), então validamos o mesmo aqui.
export function validarRg(rg) {
    const rgLimpo = (rg || "").replace(/\D/g, "");
    return rgLimpo.length >= 7 && rgLimpo.length <= 9;
}

// O back-end exige telefone com exatamente 11 dígitos (DDD + 9 dígitos).
export function validarTelefone(telefone) {
    const telefoneLimpo = (telefone || "").replace(/\D/g, "");
    return telefoneLimpo.length === 11;
}
