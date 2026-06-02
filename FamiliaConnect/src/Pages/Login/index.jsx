import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Botao from "../../components/Botao/Botao";
import Input from "../../components/Input/Input";
import logo from "../../assets/logo.png";
import styles from '../../App.module.css';
import { entrar } from "../../utils";

function Login() {

    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        entrar(cpf, senha, navigate);
    };

    return (
        <div className={styles.login}>
            <img src={logo} className={styles.logo} alt="Logo" />
            <Input nomeCampo="CPF" tipo="number" mensagem="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
            <Input nomeCampo="Senha" tipo="password" mensagem="*****" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <Botao nome="Entrar" cor="#167AFA" acao={handleLogin}/>
        </div>
    )
}

export default Login;