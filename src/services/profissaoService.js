export async function buscarProfissoes() {
    try {
        const response = await fetch('http://localhost:8080/profissoes', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) return await response.json();
        return [];
    } catch (error) {
        console.error('Erro ao buscar profissões:', error);
        return [];
    }
}
