import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CadastroFuncionario from "./pages/CadastroFuncionario";
import CadastroFamilia from "./pages/CadastroFamilia";
import CadastroCargo from "./pages/CadastroCargo";
import PaginaInicial from "./pages/PaginaInicial";
import ListaFamilias from "./pages/ListaFamilias";
import DetalhesFamilia from "./pages/DetalhesFamilia";
import EditarFamilia from "./pages/EditarFamilia";
import ListaCargos from "./Pages/ListaCargos";
import EditarCargo from "./Pages/EditarCargo";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/pagina-inicial" element={<PaginaInicial />} />
                <Route path="/cadastro-funcionario" element={<CadastroFuncionario />} />
                <Route path="/cadastro-familia" element={<CadastroFamilia />} />
                <Route path="/cadastro-cargo" element={<CadastroCargo />} />
                <Route path="/cargos" element={<ListaCargos />} />
                <Route path="/cargos/:id/editar" element={<EditarCargo />} />
                <Route path="/familias" element={<ListaFamilias />} />
                <Route path="/familias/:id" element={<DetalhesFamilia />} />
                <Route path="/familias/:id/editar-familia" element={<EditarFamilia />} />
                <Route path="/familias" element={<ListaFamilias />} />
                <Route path="/familias/:id" element={<DetalhesFamilia />} />
                <Route path="/familias/:id/editar-familia" element={<EditarFamilia />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
