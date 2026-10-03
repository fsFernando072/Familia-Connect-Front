import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral";
import Header from "../Header/Header";
import { buscarMeuAcesso } from "../../services/permissoes";
import { rotaPermitida } from "../../routes/permissoesRotas";

// Estrutura comum a todas as telas logadas: menu lateral + barra superior.
// O conteúdo de cada tela entra no <Outlet />. As permissões do cargo do usuário são carregadas aqui uma vez
// e ficam disponíveis para as telas via useOutletContext() -> { permissoes }.
function LayoutPrincipal() {
    const { pathname } = useLocation();
    const [menuAberto, setMenuAberto] = useState(false);
    const [acesso, setAcesso] = useState(undefined); // undefined = carregando, null = não logado

    useEffect(() => {
        let ativo = true;

        buscarMeuAcesso().then((resultado) => {
            if (ativo) setAcesso(resultado);
        });

        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
        if (!menuAberto) return;

        const fecharComEsc = (e) => {
            if (e.key === "Escape") setMenuAberto(false);
        };

        window.addEventListener("keydown", fecharComEsc);
        return () => window.removeEventListener("keydown", fecharComEsc);
    }, [menuAberto]);

    if (acesso === undefined) {
        return <p className="min-h-screen bg-cifa-fundo pt-24 text-center text-cifa-apagado">Carregando...</p>;
    }

    if (acesso === null) {
        return <Navigate to="/" replace />;
    }

    const { permissoes } = acesso;

    return (
        <div className="min-h-screen bg-cifa-fundo text-cifa-navy lg:pl-72">
            <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} permissoes={permissoes} />

            <div className="flex min-h-screen min-w-0 flex-col">
                <Header onAbrirMenu={() => setMenuAberto(true)} />
                <main className="flex-1 overflow-x-hidden">
                    {rotaPermitida(permissoes, pathname) ? (
                        <Outlet context={{ permissoes }} />
                    ) : (
                        <p className="mt-16 px-4 text-center text-lg text-cifa-apagado">Você não tem permissão para acessar esta página.</p>
                    )}
                </main>
            </div>
        </div>
    );
}

export default LayoutPrincipal;
