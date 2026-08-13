import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CadastroFuncionario from "./pages/CadastroFuncionario";
import CadastroFamilia from "./pages/CadastroFamilia";
import PaginaInicial from "./pages/PaginaInicial";
import ListaFamilias from "./pages/ListaFamilias";

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/pagina-inicial" element={<PaginaInicial />}/>
                <Route path="/cadastro-funcionario" element={<CadastroFuncionario />}/>
                <Route path="/cadastro-familia" element={<CadastroFamilia />}/>
                <Route path="/familias" element={<ListaFamilias />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
