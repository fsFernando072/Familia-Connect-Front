import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Formulario from "../../components/Formulario/Formulario";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import { useFeedback } from "../../hooks/useFeedback";
import { entrar } from "../../services/authService";
import { mascaraCpf } from "../../utils/mascaras";
import { COR_TURQUESA } from "../../utils/cores";

function Login() {
    const navigate = useNavigate();
    const { feedback, setFeedback, fecharFeedback } = useFeedback();

    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const campos = [
        {
            id: "cpf",
            label: "CPF do Funcionário",
            type: "text",
            value: cpf,
            onChange: (e) => setCpf(mascaraCpf(e.target.value)),
            placeholder: "000.000.000-00",
        },
        {
            id: "senha",
            label: "Senha",
            type: mostrarSenha ? "text" : "password",
            value: senha,
            onChange: (e) => setSenha(e.target.value),
            placeholder: "********",
            toggle: () => setMostrarSenha((v) => !v),
            mostrar: mostrarSenha,
        },
    ];

    const handleEntrar = () => {
        entrar(cpf.replace(/\D/g, ""), senha, navigate, setFeedback);
    };

    return (
        <div className="w-full min-h-screen overflow-x-hidden flex flex-col justify-center items-center px-4 py-10 bg-linear-to-br from-[#0c3750] via-cifa-navy to-[#0e3247]">
            <div className="w-full max-w-md bg-white rounded-3xl border border-cifa-linha shadow-xl px-6 py-8 sm:px-10 sm:py-10 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-cifa-fundo border border-cifa-linha flex items-center justify-center mb-6">
                    <img src={logo} className="w-20 h-auto" alt="Logo" />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-cifa-navy">Bem-vindo ao CIFA.</h1>
                <p className="text-cifa-apagado mt-1 mb-7 text-center">Entre com seu CPF e senha para continuar.</p>
                <Formulario campos={campos} nomeBotao="Entrar" corBotao={COR_TURQUESA} acaoBotao={handleEntrar} alinhamentoBotao="center" larguraBotao="w-full" />
            </div>
            <FeedbackToast tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} onClose={fecharFeedback} />
        </div>
    );
}

export default Login;
