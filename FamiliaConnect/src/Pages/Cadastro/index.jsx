import Input from "../../components/Input/Input";
import Botao from "../../components/Botao/Botao";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastrarFuncionario, buscarCargo } from "../../utils";
import logo from '../../assets/logo.png';
import styles from '../../App.module.css';
import Select from "../../components/Select";

function Cadastro() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmada, setSenhaConfirmada] = useState("");
    const [idCargo, setIdCargo] = useState("");
    const [foto, setFoto] = useState("");
    
    const [cargos, setCargos] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        async function obterCargos() {
            try {
                const dados = await buscarCargo();
                if (dados) {
                    setCargos(dados);
                }
            } catch (error) {
                console.error("Erro ao carregar cargos:", error);
            }
        }
        obterCargos();
    }, []);

    const handleLogin = () => {
        cadastrarFuncionario(nome, cpf, senha, senhaConfirmada, navigate);
    };

    return (
        <div className={styles.login}>
            <Input nomeCampo="Nome do Funcionário" tipo="text" mensagem="Funcionário" value={nome} onChange={(e) => setNome(e.target.value)} />
            <Input nomeCampo="CPF do Funcionário" tipo="number" mensagem="222.222.222-22" value={cpf} onChange={(e) => setCpf(e.target.value)} />
            <Input nomeCampo="Senha do Funcionário" tipo="password" mensagem="********" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <Input nomeCampo="Confirmar Senha" tipo="password" mensagem="********" value={senhaConfirmada} onChange={(e) => setSenhaConfirmada(e.target.value)} />
            <Select listaCargos={cargos} />
            
            <Botao nome="Cadastrar" cor="#34C759" acao={handleLogin} />    
        </div>
    );
}

export default Cadastro;