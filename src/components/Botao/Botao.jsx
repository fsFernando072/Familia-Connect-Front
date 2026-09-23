import { COR_NAVY } from "../../utils/cores";
const COR_TEXTO_ESCURO = COR_NAVY;
const COR_TEXTO_CLARO = "#FFFFFF";

// Luminância relativa (WCAG) de uma cor no formato #RRGGBB.
function luminancia(hex) {
    const [r, g, b] = [1, 3, 5]
        .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Escolhe entre texto claro e escuro, o que tiver mais contraste com a cor do botão.
function corDoTexto(corFundo) {
    if (!/^#[0-9a-f]{6}$/i.test(corFundo ?? "")) return COR_TEXTO_CLARO;

    const lum = luminancia(corFundo);
    const contrasteClaro = 1.05 / (lum + 0.05);
    const contrasteEscuro = (lum + 0.05) / (luminancia(COR_TEXTO_ESCURO) + 0.05);

    return contrasteEscuro > contrasteClaro ? COR_TEXTO_ESCURO : COR_TEXTO_CLARO;
}

function Botao({ cor, acao, nome, larguraBotao = "", icone: Icone, desabilitado = false }) {
    return (
        <button
            type="button"
            style={{ backgroundColor: cor, color: corDoTexto(cor) }}
            onClick={acao}
            disabled={desabilitado}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-base cursor-pointer shadow-sm transition duration-300 hover:brightness-110 active:scale-[0.98] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100 ${larguraBotao}`}
        >
            {Icone && <Icone size={16} />}
            <span>{nome}</span>
        </button>
    );
}

export default Botao;
