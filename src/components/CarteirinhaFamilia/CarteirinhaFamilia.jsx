import { Users } from "lucide-react";
import FotoAvatar from "../FotoAvatar/FotoAvatar";
import logoCifa from "../../assets/logo-cifa.png";

// Modelo visual da carteirinha (proporção 1568x553 do layout original).
// Todos os tamanhos usam cqw (unidade relativa à largura do cartão), então
// o modelo escala por inteiro em celulares, tablets e desktop.
const cq = (valor) => `calc(${valor}cqw * var(--escala, 1))`;

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
            <p className="font-bold text-black leading-tight whitespace-nowrap" style={{             fontSize: cq(1.6) }}>
                {rotulo}
            </p>
                        <p className="font-medium text-cifa-navy leading-tight break-words" style={{ fontSize: cq(1.4), marginTop: cq(0.5) }}>
                {valor || "-"}
            </p>
        </div>
    );
}

function CarteirinhaFamilia({ nomeFamilia, nomeResponsavel, cpf, telefone, fotoFamilia }) {
    return (
        <div className="overflow-x-auto">
            <div className="w-full min-w-[560px] mx-auto max-w-[1100px] [container-type:inline-size]">
                <div className="relative w-full overflow-hidden rounded-2xl bg-[#e4e7eb] border border-cifa-linha shadow-sm aspect-[1568/553] max-lg:aspect-[1568/720] max-lg:[--escala:1.2]">
                    {/* Foto da família (espaço reservado) */}
                    <div className="absolute flex items-center justify-center overflow-hidden bg-[#d4d8de] border border-white/60" style={{ left: "1.5%", top: "23.7%", width: "18%", height: "64.4%" }}>
                        <FotoAvatar caminho={fotoFamilia} alt={`Foto da família ${nomeFamilia}`} Icone={Users} tamanhoIcone={48} />
                    </div>

                    {/* Lado esquerdo: dados */}
                    <div className="absolute" style={{ left: "21.3%", top: "5%", width: "28%", height: "90%" }}>
                        <img src={logoCifa} alt="CIFA" className="object-contain object-left" style={{ width: "55%", height: "20%" }} />

                        <p className="font-bold text-[#5a5a5a] whitespace-nowrap" style={{ fontSize: cq(0.95),                         marginTop: cq(1.5) }}>
                            CI---------CARTEIRINHA DE IDENTIFICAÇÃO
                        </p>

                                                <div className="grid grid-cols-2" style={{ marginTop: cq(2), columnGap: cq(1.5), rowGap: cq(4) }}>
                            <Campo rotulo="Família" valor={nomeFamilia} />
                            <Campo rotulo="Responsável" valor={nomeResponsavel} />
                            <Campo rotulo="CPF do Resp." valor={cpf} />
                            <Campo rotulo="Telefone" valor={telefone} />
                        </div>

                        <p className="absolute right-0 bottom-0 italic font-bold text-red-500 whitespace-nowrap" style={{ fontSize: cq(0.95) }}>
                            “A venda ou cópia desse item é proibido”
                        </p>
                    </div>

                    {/* Picote central */}
                    <div className="absolute flex flex-col justify-between items-center" style={{ left: "49.7%", top: "1%", height: "98%" }} aria-hidden="true">
                        {Array.from({ length: 13 }).map((_, i) => (
                            <span key={i} className="rounded-full bg-gray-400" style={{ width: cq(0.8), height: cq(1.3) }} />
                        ))}
                    </div>

                    {/* Verso (espaço reservado) */}
                    <div className="absolute bg-white left-[65%] top-[19%] w-[20%] h-[56.7%] max-lg:left-[62.5%] max-lg:top-[22.8%] max-lg:w-[25%] max-lg:h-[54.4%] p-[1.2cqw]"><QrCodeIlustrativo /></div>

                    <img src={logoCifa} alt="" aria-hidden="true" className="absolute" style={{ right: "2%", bottom: "3%", width: "10%" }} />
                </div>
            </div>
        </div>
    );
}

export default CarteirinhaFamilia;
