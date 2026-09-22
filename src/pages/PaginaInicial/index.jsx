import { Link } from "react-router-dom";
import { ChevronRight, FolderHeart, ClipboardClock, Boxes } from "lucide-react";
import { atalhosPaginaInicial } from "../../routes/navegacaoPrincipal";

// Cartões de resumo (linha logo abaixo do destaque).
const resumos = [
    { rotulo: "Famílias atendidas", descricao: "Consulte a lista completa", rota: "/familias", Icone: FolderHeart },
    { rotulo: "Entregas registradas", descricao: "Acompanhe o histórico", rota: "/historico-entrega", Icone: ClipboardClock },
    { rotulo: "Itens em estoque", descricao: "Visualize os produtos", rota: "/produtos", Icone: Boxes },
];

// Cor do quadrado que envolve o ícone de cada atalho.
const CORES_ICONE = {
    escuro: "bg-cifa-navy text-cifa-menta",
    turquesa: "bg-cifa-turquesa text-white",
    suave: "bg-cifa-suave text-cifa-petroleo",
};

const FUNDO_DESTAQUE = {
    backgroundImage:
        "radial-gradient(60% 90% at 100% 100%, rgba(68,190,183,0.14), transparent 70%), " +
        "linear-gradient(135deg, #0c3750 0%, #0a243e 55%, #0e3247 100%)",
};

function PaginaInicial() {
    return (
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col gap-8 sm:gap-10'>

            {/* Destaque de boas-vindas */}
            <section
                style={FUNDO_DESTAQUE}
                className='relative overflow-hidden rounded-3xl border border-cifa-linha px-6 py-10 sm:px-12 sm:py-16'
            >
                <div
                    aria-hidden='true'
                    className='pointer-events-none absolute inset-0 bg-white/6'
                    style={{ clipPath: "polygon(33% 32%, 74% 0, 100% 0, 100% 24%)" }}
                />

                <div className='relative'>
                    <p className='text-sm font-semibold uppercase tracking-wide text-cifa-menta'>Página inicial</p>
                    <h1 className='mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl'>
                        Bem-vindo ao CIFA.
                    </h1>
                    <p className='mt-4 max-w-xl text-lg text-[#92b3c0]'>
                        Acesse cadastros, entregas e estoque em um só lugar.
                    </p>

                    <div className='mt-8 flex flex-wrap gap-3'>
                        <Link
                            to='/familias'
                            className='flex items-center gap-2 rounded-xl bg-cifa-menta px-5 py-3 font-bold text-cifa-navy transition hover:brightness-110 active:scale-[0.98]'
                        >
                            Ver famílias
                            <ChevronRight size={18} />
                        </Link>
                        <Link
                            to='/historico-entrega'
                            className='rounded-xl border border-[#2f455c] bg-[#223a52] px-5 py-3 font-bold text-white transition hover:bg-[#2a4560] active:scale-[0.98]'
                        >
                            Histórico de entregas
                        </Link>
                    </div>
                </div>
            </section>

            {/* Resumo */}
            <section className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                {resumos.map(({ rotulo, descricao, rota, Icone }) => (
                    <Link
                        key={rota}
                        to={rota}
                        className='group rounded-2xl border border-cifa-linha bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cifa-menta hover:shadow-md'
                    >
                        <div className='flex items-center justify-between gap-3'>
                            <p className='text-sm font-medium uppercase tracking-wide text-cifa-apagado'>{rotulo}</p>
                            <Icone size={22} className='shrink-0 text-cifa-turquesa' />
                        </div>
                        <p className='mt-5 text-3xl font-extrabold tracking-tight text-cifa-navy'>Consultar</p>
                        <p className='mt-3 text-lg text-cifa-apagado'>{descricao}</p>
                    </Link>
                ))}
            </section>

            {/* Acesso rápido */}
            <section>
                <div className='mb-5 flex items-baseline justify-between gap-4'>
                    <h2 className='text-2xl font-extrabold tracking-tight text-cifa-navy'>Acesso rápido</h2>
                    <p className='text-lg text-cifa-apagado'>Áreas do sistema</p>
                </div>

                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                    {atalhosPaginaInicial.map(({ titulo, descricao, rota, Icone, destaque }) => (
                        <Link
                            key={rota}
                            to={rota}
                            className='group flex min-h-48 flex-col rounded-2xl border border-cifa-linha bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cifa-menta hover:shadow-md'
                        >
                            <span className={`flex h-14 w-14 items-center justify-center rounded-xl ${CORES_ICONE[destaque]}`}>
                                <Icone size={26} />
                            </span>
                            <p className='mt-5 text-xl font-extrabold tracking-tight text-cifa-navy'>{titulo}</p>
                            <p className='mt-2 text-lg text-cifa-apagado'>{descricao}</p>
                            <ChevronRight
                                size={20}
                                className='mt-auto self-end text-cifa-apagado transition group-hover:translate-x-1 group-hover:text-cifa-turquesa'
                            />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default PaginaInicial;
