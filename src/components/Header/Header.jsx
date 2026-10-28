import { Bell, Menu } from "lucide-react";

// Barra superior das telas internas. No mobile mostra o botão que abre o menu lateral.
function Header({ onAbrirMenu }) {
    return (
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between gap-4 border-b border-cifa-linha bg-cifa-fundo/85 px-4 backdrop-blur sm:px-8">
            <div className="flex min-w-0 items-center gap-4">
                <button
                    type="button"
                    onClick={onAbrirMenu}
                    aria-label="Abrir menu"
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-cifa-suave text-cifa-navy transition hover:bg-cifa-linha lg:hidden"
                >
                    <Menu size={22} />
                </button>
                <p className="truncate text-lg text-cifa-apagado">Central de operações</p>
            </div>

            <button
                type="button"
                aria-label="Notificações"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-cifa-apagado transition hover:bg-cifa-suave hover:text-cifa-navy"
            >
                <Bell size={22} />
            </button>
        </header>
    );
}

export default Header;
