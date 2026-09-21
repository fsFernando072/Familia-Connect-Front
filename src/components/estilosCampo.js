// Estilos compartilhados pelos campos de formulário e pela busca.
// Mantê-los aqui evita repetir as mesmas classes em cada componente.

export const CLASSE_LABEL = 'block text-sm font-semibold text-cifa-navy mb-1.5';

export const CLASSE_INPUT =
    'w-full px-3.5 py-2.5 border border-cifa-linha rounded-xl text-base bg-white text-cifa-navy ' +
    'placeholder:text-cifa-apagado/60 transition ' +
    'focus:outline-none focus:border-cifa-menta focus:ring-4 focus:ring-cifa-menta/20';

export const CLASSE_INPUT_ERRO =
    'w-full px-3.5 py-2.5 border border-red-500 rounded-xl text-base bg-white text-cifa-navy ' +
    'placeholder:text-cifa-apagado/60 transition ' +
    'focus:outline-none focus:ring-4 focus:ring-red-400/20';
