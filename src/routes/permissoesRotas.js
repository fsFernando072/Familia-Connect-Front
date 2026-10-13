import { pode } from "../services/permissoes";

// Primeiro trecho da URL -> página de permissão (a mesma lista de checkboxes do cadastro de cargo).
const PAGINA_POR_ROTA = {
    familias: "FAMILIAS",
    funcionarios: "FUNCIONARIOS",
    produtos: "PRODUTOS",
    cargos: "CARGOS",
    categorias: "CATEGORIAS",
    "historico-entrega": "HISTORICO_ENTREGAS",
    "historico-estoque": "HISTORICO_ESTOQUE",
    dashboard: "DASHBOARD",
};

export function paginaDaRota(pathname) {
    return PAGINA_POR_ROTA[pathname.split("/")[1]] ?? null;
}

// /x/cadastro-... exige "cadastrar", /x/:id/editar-... exige "editar"; o resto (lista, detalhes) exige "listar".
function acaoDaRota(pathname) {
    if (/\/cadastro-[^/]+$/.test(pathname)) return "cadastrar";
    if (/\/editar-[^/]+$/.test(pathname)) return "editar";
    return "listar";
}

// Rotas fora do mapa (ex.: /pagina-inicial) são liberadas para qualquer usuário logado.
export function rotaPermitida(permissoes, pathname) {
    const pagina = paginaDaRota(pathname);

    return pagina === null || pode(permissoes, pagina, acaoDaRota(pathname));
}

// Em itensMenu/atalhos, cada item tem uma rota; só aparece se o usuário puder listar aquela página.
export function itemVisivel(permissoes, rota) {
    const pagina = paginaDaRota(rota);

    return pagina === null || pode(permissoes, pagina, "listar");
}
