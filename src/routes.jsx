import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CadastroFuncionario from "./pages/CadastroFuncionario";
import CadastroFamilia from "./pages/CadastroFamilia";
import CadastroProduto from './pages/CadastroProduto';
import CadastroCategoria from './pages/CadastroCategoria';
import CadastroCargo from "./pages/CadastroCargo";
import PaginaInicial from "./pages/PaginaInicial";
import ListaFamilias from "./pages/ListaFamilias";
import ListaProdutos from "./pages/ListaProdutos";
import ListaCategorias from "./pages/ListaCategorias";
import DetalhesFamilia from "./pages/DetalhesFamilia";
import EditarFamilia from "./pages/EditarFamilia";
import EditarCategoria from "./pages/EditarCategoria";
import EditarProduto from "./pages/EditarProduto";
import ListaFuncionarios from "./pages/ListaFuncionarios";
import EditarFuncionario from "./pages/EditarFuncionario";
import ListaCargos from "./pages/ListaCargos";
import EditarCargo from "./pages/EditarCargo";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/pagina-inicial" element={<PaginaInicial />}/>
                  
                <Route path="/familias" element={<ListaFamilias />}/>
                <Route path="/familias/:id" element={<DetalhesFamilia />}/>
                <Route path="/familias/cadastro-familia" element={<CadastroFamilia />}/>
                <Route path="/familias/:id/editar-familia" element={<EditarFamilia />}/>
                  
                <Route path="/produtos" element={<ListaProdutos />}/>
                <Route path="/produtos/cadastro-produto" element={<CadastroProduto />}/>
                <Route path="/produtos/:id/editar-produto" element={<EditarProduto />}/>

                <Route path="/categorias" element={<ListaCategorias />}/>
                <Route path="/categorias/cadastro-categoria" element={<CadastroCategoria />}/>
                <Route path="/categorias/:id/editar-categoria" element={<EditarCategoria />}/>
                  
                <Route path="/funcionarios" element={<ListaFuncionarios />}/>
                <Route path="/funcionarios/cadastro-funcionario" element={<CadastroFuncionario />}/>
                <Route path="/funcionarios/:id/editar-funcionario" element={<EditarFuncionario />}/>
                  
                <Route path="/cargos" element={<ListaCargos />} />
                <Route path="/cargos/cadastro-cargo" element={<CadastroCargo />} />
                <Route path="/cargos/:id/editar" element={<EditarCargo />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes; 
