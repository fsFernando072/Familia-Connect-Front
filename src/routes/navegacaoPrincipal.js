import { Home, FolderHeart, Users, Package, Briefcase, Tag, History, Archive, LayoutDashboard, ShoppingBag } from "lucide-react";
import familiasIcon from "../assets/icones-pagina-inicial/familias.png";
import funcionariosIcon from "../assets/icones-pagina-inicial/funcionarios.png";
import produtosIcon from "../assets/icones-pagina-inicial/produtos.png";
import cargosIcon from "../assets/icones-pagina-inicial/cargos.png";
import categoriasIcon from "../assets/icones-pagina-inicial/categorias.png";
import dashboardIcon from "../assets/icones-pagina-inicial/dashboard.png";
import estoqueIcon from "../assets/icones-pagina-inicial/estoque.png";
import historicoEntregaIcon from "../assets/icones-pagina-inicial/historico-entrega.png";
// Itens do menu lateral, na ordem em que aparecem.
export const itensMenu = [
    { titulo: "Início", rota: "/pagina-inicial", Icone: Home },
    { titulo: "Famílias", rota: "/familias", Icone: FolderHeart },
    { titulo: "Funcionários", rota: "/funcionarios", Icone: Users },
    { titulo: "Entregas", rota: "/entrega", Icone: ShoppingBag },
    { titulo: "Produtos", rota: "/produtos", Icone: Package },
    { titulo: "Cargos", rota: "/cargos", Icone: Briefcase },
    { titulo: "Categorias", rota: "/categorias", Icone: Tag },
    { titulo: "Histórico de Entregas", rota: "/historico-entrega", Icone: History },
    { titulo: "Histórico de Estoque", rota: "/historico-estoque", Icone: Archive },
    { titulo: "Dashboard", rota: "/dashboard", Icone: LayoutDashboard }
];

// Cartões do "Acesso rápido" da página inicial.
// `destaque` define a cor do quadrado do ícone: "escuro" | "turquesa" | "suave".
export const atalhosPaginaInicial = [
    {
        titulo: "Famílias",
        descricao: "Cadastro, vínculos e atendimentos",
        rota: "/familias",
        imagem: familiasIcon,
    },
    {
        titulo: "Entregas",
        descricao: "Realizar entregas às famílias",
        rota: "/entrega",
        Icone: ShoppingBag,
    },
    {
        titulo: "Produtos",
        descricao: "Estoque, itens e categorias",
        rota: "/produtos",
        imagem: produtosIcon,
    },
    {
        titulo: "Funcionários",
        descricao: "Equipe e dados cadastrais",
        rota: "/funcionarios",
        imagem: funcionariosIcon,
    },
    {
        titulo: "Cargos",
        descricao: "Funções e responsabilidades",
        rota: "/cargos",
        imagem: cargosIcon,
    },
    {
        titulo: "Categorias",
        descricao: "Organização dos produtos",
        rota: "/categorias",
        imagem: categoriasIcon,
    },
    {
        titulo: "Histórico de Estoque",
        descricao: "Entradas e saídas de itens",
        rota: "/historico-estoque",
        imagem: estoqueIcon,
    },
    {
        titulo: "Histórico de Entregas",
        descricao: "Famílias que receberam produtos",
        rota: "/historico-entrega",
        imagem: historicoEntregaIcon,
    },
    {
        titulo: "Dashboard",
        descricao: "Indicadores e visão geral",
        rota: "/dashboard",
        imagem: dashboardIcon,
    },
];