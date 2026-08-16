import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CadastroFuncionario from "./pages/CadastroFuncionario";
import CadastroFamilia from "./pages/CadastroFamilia";
import CadastroProduto from './Pages/CadastroProduto';
import CadastroCategoria from './Pages/CadastroCategoria';
import PaginaInicial from "./pages/PaginaInicial";
import ListaFamilias from "./pages/ListaFamilias";
import ListaProdutos from "./pages/ListaProdutos";
import ListaCategorias from "./pages/ListaCategorias";
import DetalhesFamilia from "./pages/DetalhesFamilia";
import EditarFamilia from "./pages/EditarFamilia";
import EditarCategoria from "./Pages/EditarCategoria";
import EditarProduto from "./Pages/EditarProduto";

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
                <Route path="/produtos/:id/editar-produto" element={<EditarProduto />}/>
                <Route path="/categorias/:id/editar-categoria" element={<EditarCategoria />}/>
                <Route path="/cadastro-produto" element={<CadastroProduto />}/>
                <Route path="/cadastro-categoria" element={<CadastroCategoria />}/>
                <Route path="/produtos" element={<ListaProdutos />}/>
                <Route path="/categorias" element={<ListaCategorias />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes; 
