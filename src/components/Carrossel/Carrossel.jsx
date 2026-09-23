import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Slider de passos (Responsável / Endereço / Dependentes) do cadastro de família.
// Como os 3 passos ficam lado a lado num único `flex` que desliza com translateX,
// a altura da faixa por padrão é a do passo mais alto — sobrando espaço em branco
// nos passos mais curtos. Para evitar isso, medimos a altura real do passo ativo
// e aplicamos como altura do contêiner, animando a transição junto com o slide.
function Carrossel({ passos, passoAtual }) {
    const paineisRef = useRef([]);
    const [altura, setAltura] = useState(0);

    useLayoutEffect(() => {
        const painelAtivo = paineisRef.current[passoAtual];
        if (!painelAtivo) return undefined;

        const atualizarAltura = () => setAltura(painelAtivo.scrollHeight);
        atualizarAltura();

        if (typeof ResizeObserver === "undefined") return undefined;

        // Reage a mudanças de conteúdo dentro do próprio passo (ex: mensagem de
        // "Buscando endereço...", campo de erro, dependente adicionado/removido).
        const observer = new ResizeObserver(atualizarAltura);
        observer.observe(painelAtivo);
        return () => observer.disconnect();
    }, [passoAtual]);

    // Ao trocar de passo, volta o scroll para o topo (senão o passo novo troca
    // com a tela ainda rolada no meio do passo anterior).
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [passoAtual]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-8">
                {passos.map((passo, index) => (
                    <div key={passo.titulo} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                                    index <= passoAtual ? "bg-cifa-turquesa text-white" : "bg-cifa-suave text-cifa-apagado"
                                }`}
                            >
                                {index + 1}
                            </div>
                            <span className={`text-xs font-medium whitespace-nowrap ${index <= passoAtual ? "text-cifa-navy" : "text-cifa-apagado"}`}>{passo.titulo}</span>
                        </div>
                        {index < passos.length - 1 && <div className={`w-12 md:w-20 h-0.5 mx-2 mb-5 transition-colors duration-300 ${index < passoAtual ? "bg-cifa-turquesa" : "bg-cifa-suave"}`} />}
                    </div>
                ))}
            </div>

            <div className="relative overflow-hidden transition-[height] duration-500 ease-in-out" style={{ height: altura || "auto" }}>
                <div className="flex items-start transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${passoAtual * 100}%)` }}>
                    {passos.map((passo, index) => (
                        <div
                            key={passo.titulo}
                            ref={(el) => {
                                paineisRef.current[index] = el;
                            }}
                            className="w-full shrink-0 px-1"
                        >
                            {passo.conteudo}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Carrossel;
