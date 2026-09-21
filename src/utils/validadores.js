import { somenteDigitos } from "./mascaras";

// Dígito verificador do CPF: pesos decrescentes a partir de (qtd + 1) sobre os primeiros `qtd` dígitos.
function calcularDigitoCpf(digitos, qtd) {
    let soma = 0;
    for (let i = 0; i < qtd; i++) {
        soma += Number(digitos[i]) * (qtd + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
}

export function validarCpf(cpf) {
    const cpfLimpo = somenteDigitos(cpf);

    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false; // ex: 111.111.111-11

    return calcularDigitoCpf(cpfLimpo, 9) === Number(cpfLimpo[9])
        && calcularDigitoCpf(cpfLimpo, 10) === Number(cpfLimpo[10]);
}

export function validarRg(rg) {
    const tamanho = somenteDigitos(rg).length;
    return tamanho >= 7 && tamanho <= 9;
}

export function validarTelefone(telefone) {
    const tamanho = somenteDigitos(telefone).length;
    return tamanho === 10 || tamanho === 11; // fixo ou celular
}
