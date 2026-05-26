import Botao from "./components/Botao";
import Input from "./components/Input";
import styles from './App.module.css';
import logo from './assets/logo.png'

function App() {
  return (
    <div id="login" className = {styles.login}>
      <img src={logo} className={styles.logo}/>
      <Input nomeCampo = "CPF" tipo = "number" mensagem = "000.000.000-00" id = "cpf"/>
      <Input nomeCampo = "Senha" tipo = "password" mensagem = "*****" id = "senha"/>
      <Botao nome = "Entrar" cor = "#167AFA"/>
    </div>
  );
}

export default App;
