import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import MenuLateral from "../MenuLateral/MenuLateral";
import Header from "../Header/Header";

// Estrutura comum a todas as telas logadas: menu lateral + barra superior.
// O conteúdo de cada tela entra no <Outlet />.
function LayoutPrincipal() {
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        if (!menuAberto) return;

        const fecharComEsc = (e) => {
            if (e.key === "Escape") setMenuAberto(false);
        };

        window.addEventListener("keydown", fecharComEsc);
        return () => window.removeEventListener("keydown", fecharComEsc);
    }, [menuAberto]);

    return (
        <div className="min-h-screen bg-cifa-fundo text-cifa-navy lg:pl-72">
            <MenuLateral aberto={menuAberto} onFechar={() => setMenuAberto(false)} />

            <div className="flex min-h-screen min-w-0 flex-col">
                <Header onAbrirMenu={() => setMenuAberto(true)} />
                <main className="flex-1 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default LayoutPrincipal;
