import { Home, FolderHeart, Users, Package, Briefcase, Tag, History, Archive, LayoutDashboard, ClipboardClock } from "lucide-react";

// Itens do menu lateral, na ordem em que aparecem.
export const itensMenu = [
    { titulo: "Início", rota: "/pagina-inicial", Icone: Home },
    { titulo: "Famílias", rota: "/familias", Icone: FolderHeart },
    { titulo: "Funcionários", rota: "/funcionarios", Icone: Users },
    { titulo: "Produtos", rota: "/produtos", Icone: Package },
    { titulo: "Cargos", rota: "/cargos", Icone: Briefcase },
    { titulo: "Categorias", rota: "/categorias", Icone: Tag },
    { titulo: "Histórico de Entregas", rota: "/historico-entrega", Icone: History },
    { titulo: "Histórico de Estoque", rota: "/historico-estoque", Icone: Archive },
    { titulo: "Dashboard", rota: "/dashboard", Icone: LayoutDashboard },
];

// Cartões do "Acesso rápido" da página inicial.
// `destaque` define a cor do quadrado do ícone: "escuro" | "turquesa" | "suave".
export const atalhosPaginaInicial = [
    { titulo: "Famílias", descricao: "Cadastro, vínculos e atendimentos", rota: "/familias", Icone: FolderHeart, destaque: "escuro" },
    { titulo: "Entregas", descricao: "Registros e histórico de distribuição", rota: "/historico-entrega", Icone: ClipboardClock, destaque: "escuro" },
    { titulo: "Produtos", descricao: "Estoque, itens e categorias", rota: "/produtos", Icone: Package, destaque: "turquesa" },
    { titulo: "Funcionários", descricao: "Equipe e dados cadastrais", rota: "/funcionarios", Icone: Users, destaque: "suave" },
    { titulo: "Cargos", descricao: "Funções e responsabilidades", rota: "/cargos", Icone: Briefcase, destaque: "suave" },
    { titulo: "Categorias", descricao: "Organização dos produtos", rota: "/categorias", Icone: Tag, destaque: "suave" },
    { titulo: "Histórico de Estoque", descricao: "Entradas e saídas de itens", rota: "/historico-estoque", Icone: Archive, destaque: "suave" },
    { titulo: "Dashboard", descricao: "Indicadores e visão geral", rota: "/dashboard", Icone: LayoutDashboard, destaque: "suave" },
];
