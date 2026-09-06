import logo from "../../assets/logo.png"
import Botao from "../Botao/Botao";
import { useNavigate } from "react-router-dom";

function Header(props) {

    const navigate = useNavigate();

    const handleSair = () => {
        navigate("/");
    };

    return (
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3 min-w-0">
                <img src={logo} alt="Logo" className="h-12 sm:h-15 w-auto flex-shrink-0" />
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 ml-3 truncate">CIFA - {props.nomeTela}</h1>
            </div>
            <Botao nome="Sair" cor="#2C2C2C" acao={handleSair} />
        </div>
    )
}

export default Header;