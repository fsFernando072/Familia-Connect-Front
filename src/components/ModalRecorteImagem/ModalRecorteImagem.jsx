import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { Crop } from "lucide-react";
import Botao from "../Botao/Botao";
import BotaoSecundario from "../BotaoSecundario/BotaoSecundario";
import { gerarImagemRecortada } from "../../utils/recorteImagem";

// Modal de recorte quadrado (1:1), usado antes de qualquer upload de foto
// (funcionário ou família), mantendo o mesmo avatar quadrado exibido em
// todas as telas do sistema.
//
// Renderizado via portal em document.body: como o modal usa `position: fixed`,
// ele precisa ficar fora de qualquer ancestral com `transform` (ex: o Carrossel
// do cadastro de família), senão o navegador passa a posicioná-lo em relação a
// esse ancestral em vez da tela inteira, quebrando o layout.
function ModalRecorteImagem({ aberto, imagemSrc, onCancelar, onConfirmar }) {
    const [posicao, setPosicao] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [areaRecortePx, setAreaRecortePx] = useState(null);
    const [processando, setProcessando] = useState(false);

    const aoCompletarRecorte = useCallback((_areaPercentual, areaEmPixels) => {
        setAreaRecortePx(areaEmPixels);
    }, []);

    if (!aberto) return null;

    async function confirmar() {
        if (!areaRecortePx || processando) return;

        setProcessando(true);
        try {
            const imagemRecortada = await gerarImagemRecortada(imagemSrc, areaRecortePx);
            onConfirmar(imagemRecortada);
        } catch (erro) {
            console.error("Erro ao recortar imagem:", erro);
        } finally {
            setProcessando(false);
        }
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-cifa-navy/60 backdrop-blur-sm px-4"
            onClick={processando ? undefined : onCancelar}
        >
            <div
                className="w-full max-w-sm bg-white rounded-3xl border border-cifa-linha shadow-xl p-6 flex flex-col items-center text-center gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-14 h-14 rounded-full bg-cifa-suave flex items-center justify-center">
                    <Crop size={26} className="text-cifa-turquesa" />
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-extrabold text-cifa-navy">Ajustar foto</h2>
                    <p className="text-sm text-cifa-apagado">
                        Arraste para posicionar e use o controle abaixo para dar zoom.
                    </p>
                </div>

                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-cifa-suave">
                    <Cropper
                        image={imagemSrc}
                        crop={posicao}
                        zoom={zoom}
                        aspect={1}
                        cropShape="rect"
                        showGrid={false}
                        onCropChange={setPosicao}
                        onZoomChange={setZoom}
                        onCropComplete={aoCompletarRecorte}
                    />
                </div>

                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-cifa-turquesa"
                    aria-label="Zoom da imagem"
                />

                <div className="flex items-center justify-center gap-3 w-full mt-2">
                    <BotaoSecundario
                        nome="Cancelar"
                        acao={onCancelar}
                        desabilitado={processando}
                        larguraBotao="flex-1"
                    />
                    <Botao
                        nome={processando ? "Salvando..." : "Usar foto"}
                        cor="#137D91"
                        acao={confirmar}
                        desabilitado={processando}
                        larguraBotao="flex-1"
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ModalRecorteImagem;
