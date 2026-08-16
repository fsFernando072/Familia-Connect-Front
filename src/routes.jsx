import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CadastroFuncionario from "./pages/CadastroFuncionario";
import CadastroFamilia from "./pages/CadastroFamilia";
import PaginaInicial from "./pages/PaginaInicial";
import ListaFamilias from "./pages/ListaFamilias";
import DetalhesFamilia from "./pages/DetalhesFamilia";
import EditarFamilia from "./pages/EditarFamilia";
import ListaFuncionarios from "./pages/ListaFuncionarios";
import EditarFuncionario from "./pages/EditarFuncionario";

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/pagina-inicial" element={<PaginaInicial />}/>
                <Route path="/cadastro-funcionario" element={<CadastroFuncionario />}/>
                <Route path="/cadastro-familia" element={<CadastroFamilia />}/>
                <Route path="/familias" element={<ListaFamilias />}/>
                <Route path="/familias/:id" element={<DetalhesFamilia />}/>
                <Route path="/familias/:id/editar-familia" element={<EditarFamilia />}/>
                <Route path="/funcionarios" element={<ListaFuncionarios />}/>
                <Route path="/funcionarios/:id/editar-funcionario" element={<EditarFuncionario />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
