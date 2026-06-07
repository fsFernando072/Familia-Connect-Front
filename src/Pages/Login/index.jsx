import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { entrar } from "../../utils";
import Formulario from "../../components/Formulario/Formulario";
// import { mascaraCpf } from "../../utils";

function Login() {

    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const campos = [
        {
            id: 'cpf',
            label: 'CPF do Funcionário',
            type: 'text',
            value: cpf,
            onChange: (e) => setCpf(e.target.value),
            placeholder: '000.000.000-00'
        },
        {
            id: 'senha',
            label: 'Senha',
            type: 'password',
            value: senha,
            onChange: (e) => setSenha(e.target.value),
            placeholder: '********'
        }
    ]

    const handleLogin = () => {
        entrar(cpf, senha, navigate);
    };

    return (
        <div className='w-full min-h-screen overflow-x-hidden flex flex-col justify-center items-center bg-gray-100'>
            <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center mb-7">
                <img
                    src={logo}
                    className="w-32 h-auto"
                    alt="Logo"
                />
            </div>
            <Formulario campos={campos} nomeBotao='Entrar' corBotao='#167AFA' acaoBotao={handleLogin} />
        </div>
    )
}

export default Login;