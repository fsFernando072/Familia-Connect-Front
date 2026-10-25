// Guarda os correlationId das carteirinhas que ainda estão sendo processadas pelo backend.
// Usa sessionStorage (e não useState) para sobreviver ao redirecionamento e ao recarregar a página.
// Como os cadastros são feitos em sequência, vários ids podem estar pendentes ao mesmo tempo.
// Cada item é { id, criadoEm } para o front desistir de acompanhar o que nunca termina.

const CHAVE = "carteirinhasPendentes";

export function listarCarteirinhasPendentes() {
    try {
        const itens = JSON.parse(sessionStorage.getItem(CHAVE));
        return Array.isArray(itens) ? itens.filter((item) => item?.id) : [];
    } catch {
        return [];
    }
}

function salvar(itens) {
    try {
        sessionStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch (error) {
        console.error("Erro ao guardar as carteirinhas pendentes:", error);
    }
}

export function adicionarCarteirinhaPendente(correlationId) {
    if (!correlationId) return;

    const itens = listarCarteirinhasPendentes();
    if (!itens.some((item) => item.id === correlationId)) salvar([...itens, { id: correlationId, criadoEm: Date.now() }]);
}

export function removerCarteirinhaPendente(correlationId) {
    salvar(listarCarteirinhasPendentes().filter((item) => item.id !== correlationId));
}
