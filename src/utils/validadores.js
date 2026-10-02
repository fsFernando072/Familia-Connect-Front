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

    return calcularDigitoCpf(cpfLimpo, 9) === Number(cpfLimpo[9]) && calcularDigitoCpf(cpfLimpo, 10) === Number(cpfLimpo[10]);
}

export function validarRg(rg) {
    const tamanho = somenteDigitos(rg).length;
    return tamanho >= 7 && tamanho <= 9;
}

export function validarTelefone(telefone) {
    const tamanho = somenteDigitos(telefone).length;
    return tamanho === 10 || tamanho === 11; // fixo ou celular
}

// Data de nascimento (dd/MM/yyyy, formato da mascaraData) anterior a hoje.
// O back usa @Past, então o dia de hoje também é recusado.
// Data vazia ou incompleta passa: o preenchimento obrigatório é checado em outro lugar.
export function nascimentoNoPassado(dataNascimento) {
    const [dia, mes, ano] = String(dataNascimento ?? "").split("/");

    if (!dia || !mes || !ano || ano.length !== 4) return true;

    const nascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return nascimento < hoje;
}