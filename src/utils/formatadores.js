// Converte "dd/mm/aaaa" (formato do campo mascarado) para "aaaa-mm-dd" (LocalDate do back-end).
export const converterDataParaIso = (data) => {
    if (!data) return null;
    const partes = data.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, ano] = partes;
    if (!dia || !mes || ano.length !== 4) return null;
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
};

// Converte "aaaa-mm-dd" (LocalDate vindo do back-end) para "dd/mm/aaaa" (formato do campo mascarado).
export const converterDataParaBr = (data) => {
    if (!data) return '';
    const partes = data.split('-');
    if (partes.length !== 3) return '';
    const [ano, mes, dia] = partes;
    if (!dia || !mes || !ano) return '';
    return `${dia}/${mes}/${ano}`;
};

// Converte o SexoEnum vindo do back-end ("MASCULINO", "FEMININO", "OUTRO") para o rótulo
// usado no CampoRadio do formulário ("Masculino", "Feminino", "Outro").
const SEXO_DO_BACK_PARA_LABEL = {
    MASCULINO: 'Masculino',
    FEMININO: 'Feminino',
    OUTRO: 'Outro',
};

export const converterSexoParaLabel = (sexo) => SEXO_DO_BACK_PARA_LABEL[sexo] || 'Masculino';
