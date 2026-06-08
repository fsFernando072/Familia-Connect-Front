import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { entrar, mascaraCpf } from "../../utils";
import Formulario from "../../components/Formulario/Formulario";
import Feedback from "../../components/Feedback/Feedback";

function Login() {
    
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [feedback, setFeedback] = useState({ tipo: '', msg: '', loading: false });
    const navigate = useNavigate();
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const campos = [
        {
            id: 'cpf',
            label: 'CPF do Funcionário',
            type: 'text',
            value: cpf,
            onChange: (e) => setCpf(mascaraCpf(e.target.value)),
            placeholder: '000.000.000-00'
        },
        {
            id: 'senha',
            label: 'Senha',
            type: mostrarSenha ? 'text' : 'password',
            value: senha,
            onChange: (e) => setSenha(e.target.value),
            placeholder: '********',
            toggle: () => setMostrarSenha(v => !v), 
            mostrar: mostrarSenha                      
        }
    ];

    const handleLogin = () => {
        entrar(cpf.replace(/\D/g, ""), senha, navigate, setFeedback);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden flex flex-col justify-center items-center bg-gray-100'>
            <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center mb-7">
                <img src={logo} className="w-32 h-auto" alt="Logo" />
            </div>
            <Formulario campos={campos} nomeBotao='Entrar' corBotao='#167AFA' acaoBotao={handleLogin} larguraBotao="w-1/3" posicionamentoBotao="flex justify-center"/>
            <Feedback tipo={feedback.tipo} msg={feedback.msg} loading={feedback.loading} />
        </div>
    );
}

export default Login;