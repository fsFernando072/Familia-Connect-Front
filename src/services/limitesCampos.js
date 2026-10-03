// Limites de tamanho dos campos, copiados dos @Size dos DTOs do back-end.
// Se mudar um @Size lá, mude aqui (e só aqui). Também serve para o maxLength dos inputs nas telas.
//
// RG, telefone e CEP são contados em DÍGITOS (sem máscara); os demais, em caracteres.
export const LIMITES = {
    categoria: { nome: { min: 3, max: 45 } },
    cargo: { nome: { min: 3, max: 45 }, descricao: { min: 3, max: 200 } },
    produto: { nome: { min: 3, max: 45 }, descricao: { min: 3, max: 100 } },
    funcionario: { nome: { min: 3, max: 100 }, senha: { min: 8, max: 100 } },
    pessoa: {
        nome: { min: 3, max: 100 },
        rg: { min: 7, max: 9 },
        telefone: { min: 10, max: 11 },
        profissao: { min: 3, max: 80 },
        grauParentesco: { min: 3, max: 80 },
    },
    endereco: {
        cep: { min: 8, max: 8 },
        bairro: { min: 3, max: 50 },
        logradouro: { min: 3, max: 80 },
        numero: { min: 1, max: 20 },
        complemento: { min: 3, max: 45 },
        cidade: { min: 3, max: 50 },
    },
};
