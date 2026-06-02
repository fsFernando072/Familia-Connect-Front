import logo from "../../assets/logo.png"
import styles from '../../App.module.css';
import Botao from "../Botao/Botao";
import { sair } from "../../utils";
import stylesHeader from "./Header.module.css"

function Header(props) {

    const handleLogin = () => {
        sair();
    };

    return (
        <div className={stylesHeader.header}>
            <div className={stylesHeader.logoTitulo}>
                <img src={logo} className={styles.logo} alt="Logo" />
                <h1>CIFA - {props.nomeTela}</h1>
            </div>
            <Botao nome="Sair" cor="#2C2C2C" acao={handleLogin} />
        </div>
    )
}

export default Header;