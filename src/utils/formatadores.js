// Converte "dd/mm/aaaa" (formato do campo mascarado) para "aaaa-mm-dd" (LocalDate do back-end).
export const converterDataParaIso = (data) => {
    if (!data) return null;
    const partes = data.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, ano] = partes;
    if (!dia || !mes || ano.length !== 4) return null;
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
};
