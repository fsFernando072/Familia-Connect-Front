export async function buscarEstados() {
    try {
        const response = await fetch('http://localhost:8080/estados', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) return await response.json();
        return [];
    } catch (error) {
        console.error('Erro ao buscar estados:', error);
        return [];
    }
}
