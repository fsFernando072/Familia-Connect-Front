import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Cadastro from "./Pages/Cadastro";
import CadastroFamilia from "./Pages/CadastroFamilia";

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/cadastro" element={<Cadastro />}/>
                <Route path="/cadastro-familia" element={<CadastroFamilia />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;