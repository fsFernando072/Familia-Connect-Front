import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { entrar } from "../../utils";
import Formulario from "../../components/Formulario/Formulario";

function Login() {

    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const campos = [
        {
            id: 'cpf',
            label: 'CPF',
            type: 'number',
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
        <div className='w-full min-h-screen overflow-x-hidden flex flex-col justify-center items-center'>
            <img src={logo} className="h-45 w-auto" alt="Logo" />
            <Formulario campos = {campos} nomeBotao = 'Entrar' corBotao = '#167AFA'/>
        </div>
    )
}

export default Login;