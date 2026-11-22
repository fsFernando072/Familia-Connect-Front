
import { Link, useOutletContext } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { atalhosPaginaInicial } from "../../routes/navegacaoPrincipal";
import { itemVisivel } from "../../routes/permissoesRotas";

const FUNDO_DESTAQUE = {
    backgroundImage:
        "radial-gradient(60% 90% at 100% 100%, rgba(68,190,183,0.14), transparent 70%), " +
        "linear-gradient(135deg, #0c3750 0%, #0a243e 55%, #0e3247 100%)",
};

function PaginaInicial() {
    const { permissoes } = useOutletContext();

    const atalhos = atalhosPaginaInicial.filter(({ rota }) =>
        itemVisivel(permissoes, rota)
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col gap-8 sm:gap-10">

            {/* Destaque de boas-vindas */}
            <section
                style={FUNDO_DESTAQUE}
                className="relative overflow-hidden rounded-3xl border border-cifa-linha px-6 py-10 sm:px-12 sm:py-16"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white/6"
                    style={{
                        clipPath: "polygon(33% 32%, 74% 0, 100% 0, 100% 24%)"
                    }}
                />

                <div className="relative">
                    <p className="text-sm font-semibold uppercase tracking-wide text-cifa-menta">
                        Página inicial
                    </p>

                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                        Bem-vindo ao CIFA.
                    </h1>

                    <p className="mt-4 max-w-xl text-lg text-[#92b3c0]">
                        Acesse cadastros, entregas e estoque em um só lugar.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {itemVisivel(permissoes, "/familias") && (
                            <Link
                                to="/familias"
                                className="flex items-center gap-2 rounded-xl bg-cifa-menta px-5 py-3 font-bold text-cifa-navy transition hover:brightness-110 active:scale-[0.98]"
                            >
                                Ver famílias
                                <ChevronRight size={18} />
                            </Link>
                        )}

                        {itemVisivel(permissoes, "/historico-entrega") && (
                            <Link
                                to="/historico-entrega"
                                className="rounded-xl border border-[#2f455c] bg-[#223a52] px-5 py-3 font-bold text-white transition hover:bg-[#2a4560] active:scale-[0.98]"
                            >
                                Histórico de Entregas
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Acesso rápido */}
            <section>
                <div className="mb-5 flex items-baseline justify-between gap-4">
                    <h2 className="text-2xl font-extrabold tracking-tight text-cifa-navy">
                        Acesso rápido
                    </h2>

                    <p className="text-lg text-cifa-apagado">
                        Áreas do sistema
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {atalhos.map(({ titulo, descricao, rota, Icone, imagem }) => (
                        <Link
                            key={rota}
                            to={rota}
                            className="group flex min-h-56 flex-col items-center rounded-2xl border border-cifa-linha bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-cifa-menta hover:shadow-md"
                        >
                            {/* Ícone centralizado */}
                            <div className="flex h-20 w-full items-center justify-center">
                                {imagem ? (
                                    <img
                                        src={imagem}
                                        alt=""
                                        aria-hidden="true"
                                        className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : Icone ? (
                                    <Icone
                                        size={58}
                                        strokeWidth={1.8}
                                        className="text-cifa-navy transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : null}
                            </div>

                            {/* Título */}
                            <p className="mt-4 text-xl font-extrabold tracking-tight text-cifa-navy">
                                {titulo}
                            </p>

                            {/* Descrição */}
                            <p className="mt-2 text-base text-cifa-apagado">
                                {descricao}
                            </p>

                            {/* Indicador de acesso */}
                            <ChevronRight
                                size={20}
                                className="mt-auto self-end text-cifa-apagado transition group-hover:translate-x-1 group-hover:text-cifa-turquesa"
                            />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default PaginaInicial;