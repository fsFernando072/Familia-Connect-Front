import { AlertTriangle } from "lucide-react";

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
                    <button
                        onClick={onCancelar}
                        disabled={carregando}
                        className="flex-1 px-6 py-2.5 rounded-xl font-bold text-gray-900 border border-gray-300 hover:bg-gray-50 cursor-pointer transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {textoCancelar}
                    </button>
                    <button
                        onClick={onConfirmar}
                        disabled={carregando}
                        style={{ backgroundColor: corConfirmar }}
                        className="flex-1 px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90 cursor-pointer transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {carregando ? "Aguarde..." : textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacao;
