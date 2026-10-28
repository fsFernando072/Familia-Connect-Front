import logoCifa from "../../assets/logo-cifa.png";

// Modelo visual da carteirinha (proporção 2000x707 do layout).
// Todos os tamanhos usam cqw (unidade relativa à largura do cartão), então
// o modelo escala por inteiro em celulares, tablets e desktop.
const cq = (valor) => `calc(${valor}cqw * var(--escala, 1))`;

const AZUL_CIFA = "#20488f";
const CORES_FAIXA = [AZUL_CIFA, "#22a45d", "#f4b400", "#e53935"];

// QR Code ilustrativo (não funcional): três marcadores de canto + módulos pseudoaleatórios fixos.
const TAMANHO_QR = 25;

function ehMarcador(x, y) {
    const noCanto = (cx, cy) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
    return noCanto(0, 0) || noCanto(TAMANHO_QR - 7, 0) || noCanto(0, TAMANHO_QR - 7);
}

function QrCodeIlustrativo() {
    const modulos = [];
    let semente = 7;

    for (let y = 0; y < TAMANHO_QR; y++) {
        for (let x = 0; x < TAMANHO_QR; x++) {
            semente = (semente * 1103515245 + 12345) % 2147483648;
            if (!ehMarcador(x, y) && semente % 3 !== 0) modulos.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
        }
    }

    const marcador = (x, y) => (
        <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="7" height="7" />
            <rect x={x + 1} y={y + 1} width="5" height="5" fill="white" />
            <rect x={x + 2} y={y + 2} width="3" height="3" />
        </g>
    );

    return (
        <svg viewBox={`-1 -1 ${TAMANHO_QR + 2} ${TAMANHO_QR + 2}`} className="w-full h-full" fill="#111" shapeRendering="crispEdges" role="img" aria-label="QR Code ilustrativo">
            {modulos}
            {marcador(0, 0)}
            {marcador(TAMANHO_QR - 7, 0)}
            {marcador(0, TAMANHO_QR - 7)}
        </svg>
    );
}

function Campo({ rotulo, valor }) {
    return (
        <div className="min-w-0">
            <p className="font-semibold uppercase tracking-wider text-[#6b7280] leading-tight whitespace-nowrap" style={{ fontSize: cq(1) }}>
                {rotulo}
            </p>
            <p className="font-semibold text-[#111] leading-tight whitespace-nowrap" style={{ fontSize: cq(1.45), marginTop: cq(0.4) }}>
                {valor || "-"}
            </p>
        </div>
    );
}

function rotuloMembros(quantidade) {
    return `${quantidade} ${quantidade === 1 ? "membro" : "membros"}`;
}

function CarteirinhaFamilia({ nomeFamilia, nomeResponsavel, cpf, telefone, quantidadeMembros = 1, dataEmissao = new Date().toLocaleDateString("pt-BR") }) {
    return (
        <div className="overflow-x-auto">
            <div className="w-full min-w-[560px] mx-auto max-w-[1100px] [container-type:inline-size]">
                <div className="relative w-full overflow-hidden rounded-2xl bg-[#e4e7eb] border border-cifa-linha shadow-sm aspect-[2000/707] max-lg:aspect-[2000/860] max-lg:[--escala:1.2]">
                    {/* Lado esquerdo: dados */}
                    <div className="absolute left-0 top-0 h-full" style={{ width: "48.8%", padding: `${cq(2.7)} ${cq(2.5)} 0 ${cq(2.5)}` }}>
                        <div className="flex items-start justify-between">
                            <img src={logoCifa} alt="CIFA" style={{ width: cq(13.5) }} />

                            <div className="text-right">
                                <p className="font-semibold uppercase tracking-wider text-[#6b7280]" style={{ fontSize: cq(1), marginTop: cq(1) }}>
                                    Emitida em
                                </p>
                                <p className="font-bold" style={{ fontSize: cq(1.5), color: AZUL_CIFA, marginTop: cq(0.3) }}>
                                    {dataEmissao}
                                </p>
                            </div>
                        </div>

                        <p className="font-bold uppercase tracking-[0.15em] text-[#6b7280] whitespace-nowrap" style={{ fontSize: cq(0.95), marginTop: cq(2.6) }}>
                            Carteirinha de identificação
                        </p>

                        <p className="font-extrabold leading-tight whitespace-nowrap" style={{ fontSize: cq(3.1), color: AZUL_CIFA, marginTop: cq(0.4) }}>
                            Família {nomeFamilia || "-"}
                        </p>

                        <span className="inline-block rounded-full font-semibold text-white whitespace-nowrap" style={{ backgroundColor: AZUL_CIFA, fontSize: cq(1.1), padding: `${cq(0.5)} ${cq(1)}`, marginTop: cq(0.9) }}>
                            {rotuloMembros(quantidadeMembros)}
                        </span>

                        <div className="flex" style={{ marginTop: cq(2.4), columnGap: cq(1.9) }}>
                            <Campo rotulo="Responsável" valor={nomeResponsavel} />
                            <Campo rotulo="CPF" valor={cpf} />
                            <Campo rotulo="Telefone" valor={telefone} />
                        </div>

                        <p className="absolute italic text-red-500 whitespace-nowrap" style={{ left: cq(2.5), bottom: cq(2), fontSize: cq(1.1) }}>
                            “A venda ou cópia deste item é proibida.”
                        </p>
                    </div>

                    {/* Faixa colorida inferior */}
                    <div className="absolute left-0 bottom-0 flex" style={{ width: "48.8%", height: cq(0.7) }} aria-hidden="true">
                        {CORES_FAIXA.map((cor) => (
                            <span key={cor} className="flex-1" style={{ backgroundColor: cor }} />
                        ))}
                    </div>

                    {/* Picote central */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col justify-between items-center" style={{ top: "1%", height: "98%" }} aria-hidden="true">
                        {Array.from({ length: 13 }).map((_, i) => (
                            <span key={i} className="rounded-full bg-gray-400" style={{ width: cq(0.8), height: cq(1.1) }} />
                        ))}
                    </div>

                    {/* Verso: QR Code (ilustrativo) */}
                    <div className="absolute bg-white left-[75.5%] top-[52.3%] w-[26.5%] -translate-x-1/2 -translate-y-1/2 aspect-square max-lg:w-[30%] max-lg:top-1/2" style={{ padding: cq(1.2) }}>
                        <QrCodeIlustrativo />
                    </div>

                    <img src={logoCifa} alt="" aria-hidden="true" className="absolute" style={{ right: "1.8%", bottom: "4%", width: "6.5%" }} />
                </div>
            </div>
        </div>
    );
}

export default CarteirinhaFamilia;
