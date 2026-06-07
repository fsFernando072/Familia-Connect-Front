import logo from "../../assets/logo.png"
import Botao from "../Botao/Botao";
import { useNavigate } from "react-router-dom";

function Header(props) {

    const navigate = useNavigate();

    const handleSair = () => {
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    return (
        <div className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="h-15 w-auto" />
                <h1 className="text-2xl font-bold text-gray-900 ml-3">CIFA - {props.nomeTela}</h1>
            </div>
            <Botao nome="Sair" cor="#2C2C2C" acao={handleSair} />
        </div>
    )
}

export default Header;