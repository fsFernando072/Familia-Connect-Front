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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onCancelar}
        >
            <div
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={28} className="text-red-600" />
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>
                    {mensagem && <p className="text-sm text-gray-500">{mensagem}</p>}
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
