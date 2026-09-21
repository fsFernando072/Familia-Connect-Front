import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { itensMenu } from "../../routes/navegacaoPrincipal";

const CLASSE_ITEM = "flex items-center gap-3 w-full h-12 [@media(max-height:700px)]:h-10 px-4 rounded-xl text-[15px] font-medium transition-colors duration-200";

function MenuLateral({ aberto, onFechar }) {

    const navigate = useNavigate();

    const handleSair = () => {
        onFechar();
        navigate("/");
    };

    return (
        <>
            {/* Fundo escurecido: só aparece no mobile, com o menu aberto */}
            {aberto && (
                <div
                    className="fixed inset-0 z-30 bg-cifa-navy/60 backdrop-blur-sm lg:hidden"
                    onClick={onFechar}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-cifa-navy transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    aberto ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-label="Menu principal"
            >
                <div className="flex items-center gap-3 px-6 pt-7 pb-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cifa-menta text-lg font-extrabold text-cifa-navy">
                        C
                    </div>
                    <div className="leading-tight">
                        <p className="text-lg font-extrabold tracking-tight text-white">CIFA</p>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#92b3c0]">Assistência Social</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 pb-4 [scrollbar-thin] [scrollbar-color:rgba(255,255,255,0.18)_transparent]">
                    <ul className="flex flex-col gap-1">
                        {itensMenu.map(({ titulo, rota, Icone }) => (
                            <li key={rota}>
                                <NavLink
                                    to={rota}
                                    onClick={onFechar}
                                    className={({ isActive }) =>
                                        `${CLASSE_ITEM} ${
                                            isActive
                                                ? "bg-cifa-petroleo text-white shadow-sm ring-1 ring-white/5"
                                                : "text-cifa-menu hover:bg-white/5 hover:text-white"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icone size={20} className={isActive ? "text-cifa-menta" : ""} />
                                            <span className="truncate">{titulo}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="border-t border-white/10 px-3 py-4">
                    <button
                        type="button"
                        onClick={handleSair}
                        className={`${CLASSE_ITEM} cursor-pointer text-cifa-menu hover:bg-white/5 hover:text-white`}
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>
        </>
    );
}

export default MenuLateral;
