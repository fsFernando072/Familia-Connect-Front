import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";

import iconeFamilia from "../../assets/icones-pagina-inicial/familia.png";
import iconeFuncionario from "../../assets/icones-pagina-inicial/funcionario.png";
import iconeProduto from "../../assets/icones-pagina-inicial/produto.png";
import iconeListaFamilias from "../../assets/icones-pagina-inicial/lista-familias.png";
import iconeListaFuncionarios from "../../assets/icones-pagina-inicial/lista-funcionarios.png";
import iconeListaProdutos from "../../assets/icones-pagina-inicial/lista-produtos.png";
import iconeCargo from "../../assets/icones-pagina-inicial/cargo.png";
import iconeHistoricoEntrega from "../../assets/icones-pagina-inicial/historico-entrega.png";
import iconeDashboard from "../../assets/icones-pagina-inicial/dashboard.png";

const cartoes = [
    { titulo: "Cadastro de Família", rota: "/cadastro-familia", icone: iconeFamilia },
    { titulo: "Cadastro de Funcionário", rota: "/cadastro-funcionario", icone: iconeFuncionario },
    { titulo: "Cadastro de Produto", rota: "/cadastro-produto", icone: iconeProduto },
    { titulo: "Lista de Famílias", rota: "/familias", icone: iconeListaFamilias },
    { titulo: "Lista de Funcionários", rota: "/funcionarios", icone: iconeListaFuncionarios },
    { titulo: "Lista de Produtos", rota: "/produtos", icone: iconeListaProdutos },
    { titulo: "Cadastro de Cargo", rota: "/cadastro-cargo", icone: iconeCargo },
    { titulo: "Histórico de Entrega", rota: "/historico-entrega", icone: iconeHistoricoEntrega },
    { titulo: "Dashboard", rota: "/dashboard", icone: iconeDashboard }
];

function PaginaInicial() {
    return (
        <div className='w-full min-h-screen overflow-x-hidden bg-gray-100'>
            <Header nomeTela='Página Inicial' />
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 py-8 max-w-5xl mx-auto'>
                {cartoes.map(({ titulo, rota, icone }) => (
                    <Link
                        key={rota}
                        to={rota}
                        className='flex flex-col items-center justify-center gap-5 bg-white border border-gray-200 rounded-xl shadow-sm py-8 px-4 text-center hover:scale-105 hover:shadow-md transition duration-300 ease-in-out cursor-pointer'
                    >
                        <span className='text-base font-bold text-gray-900'>{titulo}</span>
                        <img src={icone} alt={titulo} className='h-12 w-auto object-contain' />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default PaginaInicial;
