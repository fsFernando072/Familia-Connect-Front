import { UploadCloud, Info } from "lucide-react";
import BotaoSecundario from "../BotaoSecundario/BotaoSecundario";
import { TAMANHO_MAXIMO_ARQUIVO_MB, LIMITE_IMPORTACOES_POR_HORA } from "../../services/ocrService";

function ModalImportarFoto({ aberto, carregando = false, erro = "", onFechar, onSelecionarArquivo }) {
    if (!aberto) return null;

    const handleChange = (e) => {
        const arquivo = e.target.files[0];
        e.target.value = "";
        if (arquivo) onSelecionarArquivo(arquivo);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={carregando ? undefined : onFechar}
        >
            <div
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <UploadCloud size={28} className="text-[#167AFA]" />
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-gray-900">Importar Arquivo</h2>
                    <p className="text-sm text-gray-500">
                        Envie a foto do formulário da família para preencher o cadastro automaticamente.
                    </p>
                </div>

                <div className="w-full flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-md p-3 text-left">
                    <Info size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">
                        A foto deve ter no máximo {TAMANHO_MAXIMO_ARQUIVO_MB}MB e o limite é de{" "}
                        {LIMITE_IMPORTACOES_POR_HORA} fotos importadas por hora.
                    </p>
                </div>

                {erro && (
                    <p className="text-sm text-red-600 w-full text-left">{erro}</p>
                )}

                <div className="flex items-center justify-center gap-3 w-full mt-2">
                    <BotaoSecundario
                        nome="Cancelar"
                        acao={onFechar}
                        desabilitado={carregando}
                        larguraBotao="flex-1"
                    />
                    <label
                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-base text-white text-center transition duration-300 ${
                            carregando
                                ? "bg-[#167AFA]/60 cursor-not-allowed"
                                : "bg-[#167AFA] hover:opacity-90 cursor-pointer"
                        }`}
                    >
                        {carregando ? "Enviando..." : "Selecionar Foto"}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={carregando}
                            onChange={handleChange}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}

export default ModalImportarFoto;
