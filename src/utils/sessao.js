// Guarda no navegador quem é o funcionário logado, para as telas poderem enviar o id dele ao backend
// (ex.: quem realizou a entrega). Usa sessionStorage: some ao fechar a aba, assim como a sessão.

const CHAVE_FUNCIONARIO = "funcionarioLogado";

// O backend pode devolver o funcionário direto ou dentro de uma chave; aceita os formatos mais comuns.
function extrairIdFuncionario(dados) {
    const funcionario = dados?.funcionario ?? dados;
    return funcionario?.id ?? funcionario?.idFuncionario ?? null;
}

export function salvarFuncionarioLogado(dadosLogin) {
    const id = extrairIdFuncionario(dadosLogin);

    if (id === null || id === undefined) return;

    try {
        sessionStorage.setItem(CHAVE_FUNCIONARIO, JSON.stringify({ id: Number(id), nome: dadosLogin?.nome ?? dadosLogin?.funcionario?.nome ?? null }));
    } catch (error) {
        console.error("Erro ao guardar o funcionário logado:", error);
    }
}

export function obterFuncionarioLogado() {
    try {
        return JSON.parse(sessionStorage.getItem(CHAVE_FUNCIONARIO));
    } catch {
        return null;
    }
}

export function limparSessao() {
    sessionStorage.removeItem(CHAVE_FUNCIONARIO);
}
