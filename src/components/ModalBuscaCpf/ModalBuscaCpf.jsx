import { useState } from "react";
import { createPortal } from "react-dom";
import BotaoSecundario from "../BotaoSecundario/BotaoSecundario";
import CampoTexto from "../CampoTexto/CampoTexto";
import { mascaraCpf } from "../../utils/mascaras";
import { validarCpf } from "../../utils/validadores";
import { COR_TURQUESA } from "../../utils/cores";

// Alternativa ao QR Code quando a família perdeu a carteirinha: busca o responsável pelo CPF.
// `onBuscar(cpf)` é assíncrona e devolve a mensagem de erro (string) ou null se deu certo; o modal só
// mostra o erro e quem fecha o modal no sucesso é a tela. Renderizado via portal (mesmo motivo do ModalConfirmacao).
function ModalBuscaCpf({ aberto, onBuscar, onFechar }) {
    const [cpf, setCpf] = useState("");
    const [erro, setErro] = useState("");
    const [buscando, setBuscando] = useState(false);

    if (!aberto) return null;

    const fechar = () => {
        if (buscando) return;
        setCpf("");
        setErro("");
        onFechar();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarCpf(cpf)) {
            setErro("Informe um CPF válido.");
            return;
        }

        setErro("");
        setBuscando(true);
        const erroBusca = await onBuscar(cpf);
        setBuscando(false);

        if (erroBusca) {
            setErro(erroBusca);
            return;
        }

        setCpf("");
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cifa-navy/60 backdrop-blur-sm px-4" onClick={fechar}>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl border border-cifa-linha shadow-xl p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col gap-1 text-center">
                    <h2 className="text-lg font-extrabold text-cifa-navy">Carteirinha perdida</h2>
                    <p className="text-sm text-cifa-apagado">Informe o CPF do responsável pela família.</p>
                </div>

                <CampoTexto
                    label="CPF do Responsável"
                    value={cpf}
                    onChange={(e) => {
                        setCpf(mascaraCpf(e.target.value));
                        setErro("");
                    }}
                    placeholder="444.444.444-44"
                    maxLength={14}
                    erro={erro}
                    disabled={buscando}
                />

                <div className="flex items-center justify-center gap-3 w-full mt-2">
                    <BotaoSecundario nome="Cancelar" acao={fechar} desabilitado={buscando} larguraBotao="flex-1" />
                    <button
                        type="submit"
                        disabled={buscando}
                        style={{ backgroundColor: COR_TURQUESA }}
                        className="flex-1 flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-base text-white cursor-pointer shadow-sm transition duration-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {buscando ? "Buscando..." : "Buscar"}
                    </button>
                </div>
            </form>
        </div>,
        document.body
    );
}

export default ModalBuscaCpf;
