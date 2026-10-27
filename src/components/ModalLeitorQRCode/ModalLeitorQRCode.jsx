import { useState } from "react";
import { createPortal } from "react-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import BotaoSecundario from "../BotaoSecundario/BotaoSecundario";

// Renderizado via portal em document.body (mesmo motivo do ModalConfirmacao).
// Ao ler um QR Code, devolve o texto lido em `onLeitura`. O Scanner só existe enquanto o modal está aberto,
// então a câmera é liberada ao fechar.
function ModalLeitorQRCode({ aberto, onLeitura, onFechar }) {
    const [erroCamera, setErroCamera] = useState("");

    if (!aberto) return null;

    const handleScan = (resultados) => {
        const valor = resultados?.[0]?.rawValue;
        if (valor) onLeitura(valor);
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cifa-navy/60 backdrop-blur-sm px-4" onClick={onFechar}>
            <div className="w-full max-w-md bg-white rounded-3xl border border-cifa-linha shadow-xl p-6 flex flex-col items-center text-center gap-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-extrabold text-cifa-navy">Ler QR Code</h2>
                    <p className="text-sm text-cifa-apagado">Aponte a câmera para o QR Code da família.</p>
                </div>

                {erroCamera ? (
                    <p className="text-sm text-red-600">{erroCamera}</p>
                ) : (
                    <div className="w-full overflow-hidden rounded-2xl">
                        <Scanner
                            onScan={handleScan}
                            onError={() => setErroCamera("Não foi possível acessar a câmera. Verifique a permissão do navegador.")}
                            formats={["qr_code"]}
                            constraints={{ facingMode: "environment" }}
                            allowMultiple={false}
                        />
                    </div>
                )}

                <BotaoSecundario nome="Cancelar" acao={onFechar} larguraBotao="w-full" />
            </div>
        </div>,
        document.body
    );
}

export default ModalLeitorQRCode;
