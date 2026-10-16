import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { Crop, RotateCw } from "lucide-react";
import Botao from "../Botao/Botao";
import BotaoSecundario from "../BotaoSecundario/BotaoSecundario";
import { gerarImagemRecortada, gerarImagemRecortadaProporcional } from "../../utils/recorteImagem";
import { COR_TURQUESA } from "../../utils/cores";

// Modal de recorte. Por padrão é quadrado (1:1), usado antes do upload de foto
// (funcionário ou família), mantendo o mesmo avatar quadrado exibido em todas as telas.
//
// Para recorte retangular (ex: formulário do OCR) informe `aspect` diferente de 1;
// nesse caso a saída mantém a proporção, respeita `larguraMaxima`/`tamanhoMaximoBytes`
// e, com `permitirRotacao`, aparece o botão de girar 90° (útil para fotos de celular
// tiradas "deitadas").
//
// Renderizado via portal em document.body: como o modal usa `position: fixed`,
// ele precisa ficar fora de qualquer ancestral com `transform` (ex: o Carrossel
// do cadastro de família), senão o navegador passa a posicioná-lo em relação a
// esse ancestral em vez da tela inteira, quebrando o layout.
function ModalRecorteImagem({
    aberto,
    imagemSrc,
    onCancelar,
    onConfirmar,
    aspect = 1,
    titulo = "Ajustar foto",
    descricao = "Arraste para posicionar e use o controle abaixo para dar zoom.",
    textoConfirmar = "Usar foto",
    permitirRotacao = false,
    larguraMaxima = 1800,
    tamanhoMaximoBytes,
}) {
    const [posicao, setPosicao] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotacao, setRotacao] = useState(0);
    const [areaRecortePx, setAreaRecortePx] = useState(null);
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState("");

    const retangular = aspect !== 1;

    // Cada nova imagem começa do zero (zoom, posição e rotação).
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPosicao({ x: 0, y: 0 });
        setZoom(1);
        setRotacao(0);
        setAreaRecortePx(null);
        setErro("");
    }, [imagemSrc]);

    const handleRecorteCompleto = useCallback((_areaPercentual, areaEmPixels) => {
        setAreaRecortePx(areaEmPixels);
    }, []);

    if (!aberto) return null;

    const handleConfirmar = async () => {
        if (!areaRecortePx || processando) return;

        setProcessando(true);
        setErro("");
        try {
            const imagemRecortada = retangular
                ? await gerarImagemRecortadaProporcional(imagemSrc, areaRecortePx, { rotacao, larguraMaxima, tamanhoMaximoBytes })
                : await gerarImagemRecortada(imagemSrc, areaRecortePx);
            onConfirmar(imagemRecortada);
        } catch (e) {
            console.error("Erro ao recortar imagem:", e);
            setErro("Não foi possível recortar a imagem. Tente novamente.");
        } finally {
            setProcessando(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cifa-navy/60 backdrop-blur-sm px-4" onClick={processando ? undefined : onCancelar}>
            <div
                className={`w-full ${retangular ? "max-w-2xl" : "max-w-sm"} bg-white rounded-3xl border border-cifa-linha shadow-xl p-6 flex flex-col items-center text-center gap-4`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-14 h-14 rounded-full bg-cifa-suave flex items-center justify-center">
                    <Crop size={26} className="text-cifa-turquesa" />
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-extrabold text-cifa-navy">{titulo}</h2>
                    <p className="text-sm text-cifa-apagado">{descricao}</p>
                </div>

                <div className={`relative w-full ${retangular ? "h-72 sm:h-96" : "h-64"} rounded-xl overflow-hidden bg-cifa-suave`}>
                    <Cropper
                        image={imagemSrc}
                        crop={posicao}
                        zoom={zoom}
                        rotation={rotacao}
                        aspect={aspect}
                        cropShape="rect"
                        showGrid={retangular}
                        onCropChange={setPosicao}
                        onZoomChange={setZoom}
                        onCropComplete={handleRecorteCompleto}
                    />
                </div>

                <div className="w-full flex items-center gap-3">
                    <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-cifa-turquesa" aria-label="Zoom da imagem" />
                    {permitirRotacao && (
                        <button
                            type="button"
                            onClick={() => setRotacao((r) => (r + 90) % 360)}
                            disabled={processando}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cifa-linha text-sm font-bold text-cifa-navy hover:bg-cifa-suave transition duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            aria-label="Girar imagem 90 graus"
                        >
                            <RotateCw size={16} />
                            Girar
                        </button>
                    )}
                </div>

                {erro && <p className="text-sm text-red-600 w-full text-left">{erro}</p>}

                <div className="flex items-center justify-center gap-3 w-full mt-2">
                    <BotaoSecundario nome="Cancelar" acao={onCancelar} desabilitado={processando} larguraBotao="flex-1" />
                    <Botao nome={processando ? "Salvando..." : textoConfirmar} cor={COR_TURQUESA} acao={handleConfirmar} desabilitado={processando} larguraBotao="flex-1" />
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ModalRecorteImagem;
