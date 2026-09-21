import { AlertTriangle } from "lucide-react";
import Botao from "../Botao/Botao";
import BotaoSecundario from "../BotaoSecundario/BotaoSecundario";

function ModalConfirmacao({
    aberto,
    titulo = "Tem certeza?",
    mensagem,
    textoConfirmar = "Sim",
    textoCancelar = "Não",
    corConfirmar = "#DC2626",
    carregando = false,
    onConfirmar,
    onCancelar
}) {
    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-cifa-navy/60 backdrop-blur-sm px-4"
            onClick={onCancelar}
        >
            <div
                className="w-full max-w-sm bg-white rounded-3xl border border-cifa-linha shadow-xl p-6 flex flex-col items-center text-center gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={28} className="text-red-600" />
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-extrabold text-cifa-navy">{titulo}</h2>
                    {mensagem && <p className="text-sm text-cifa-apagado">{mensagem}</p>}
                </div>

                <div className="flex items-center justify-center gap-3 w-full mt-2">
                    <BotaoSecundario
                        nome={textoCancelar}
                        acao={onCancelar}
                        desabilitado={carregando}
                        larguraBotao="flex-1"
                    />
                    <Botao
                        nome={carregando ? "Aguarde..." : textoConfirmar}
                        cor={corConfirmar}
                        acao={onConfirmar}
                        desabilitado={carregando}
                        larguraBotao="flex-1"
                    />
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacao;
