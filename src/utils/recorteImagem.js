function carregarImagem(url) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();
        imagem.addEventListener("load", () => resolve(imagem));
        imagem.addEventListener("error", (erro) => reject(erro));
        imagem.setAttribute("crossOrigin", "anonymous");
        imagem.src = url;
    });
}

function canvasParaBlob(canvas, qualidade) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem recortada."))), "image/jpeg", qualidade);
    });
}

// Tamanho da "caixa" que envolve a imagem depois de girada (mesma conta que o react-easy-crop usa
// para devolver a área de recorte quando `rotation` != 0).
function tamanhoRotacionado(largura, altura, rotacaoGraus) {
    const rad = (rotacaoGraus * Math.PI) / 180;
    return {
        largura: Math.abs(Math.cos(rad) * largura) + Math.abs(Math.sin(rad) * altura),
        altura: Math.abs(Math.sin(rad) * largura) + Math.abs(Math.cos(rad) * altura),
    };
}

function desenharImagemRotacionada(imagem, rotacaoGraus) {
    const { largura, altura } = tamanhoRotacionado(imagem.naturalWidth, imagem.naturalHeight, rotacaoGraus);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(largura);
    canvas.height = Math.round(altura);

    const contexto = canvas.getContext("2d");
    contexto.translate(canvas.width / 2, canvas.height / 2);
    contexto.rotate((rotacaoGraus * Math.PI) / 180);
    contexto.translate(-imagem.naturalWidth / 2, -imagem.naturalHeight / 2);
    contexto.drawImage(imagem, 0, 0);

    return canvas;
}

/**
 * Recorta `imagemSrc` de acordo com a área (em pixels, no formato que o
 * react-easy-crop devolve em `onCropComplete`) e devolve um Blob JPEG quadrado,
 * pronto para ser enviado no FormData (o back só exige `arquivo instanceof Blob`).
 *
 * @param {string} imagemSrc data URL ou object URL da imagem original
 * @param {{x:number,y:number,width:number,height:number}} areaRecortePx
 * @param {number} tamanhoSaida lado do quadrado final, em pixels
 */
export async function gerarImagemRecortada(imagemSrc, areaRecortePx, tamanhoSaida = 512) {
    const imagem = await carregarImagem(imagemSrc);

    const canvas = document.createElement("canvas");
    canvas.width = tamanhoSaida;
    canvas.height = tamanhoSaida;

    const contexto = canvas.getContext("2d");
    contexto.drawImage(imagem, areaRecortePx.x, areaRecortePx.y, areaRecortePx.width, areaRecortePx.height, 0, 0, tamanhoSaida, tamanhoSaida);

    return canvasParaBlob(canvas, 0.9);
}

/**
 * Versão retangular (qualquer proporção) do recorte. Mantém a proporção da área
 * escolhida, aplica a rotação (múltiplos de 90° ou qualquer ângulo) e garante que
 * o resultado caiba em `larguraMaxima` e, se informado, em `tamanhoMaximoBytes`
 * (reduz a qualidade e depois a resolução até caber).
 *
 * @param {string} imagemSrc data URL ou object URL da imagem original
 * @param {{x:number,y:number,width:number,height:number}} areaRecortePx
 * @param {{rotacao?:number, larguraMaxima?:number, tamanhoMaximoBytes?:number}} opcoes
 */
export async function gerarImagemRecortadaProporcional(imagemSrc, areaRecortePx, { rotacao = 0, larguraMaxima = 1800, tamanhoMaximoBytes } = {}) {
    const imagem = await carregarImagem(imagemSrc);
    const origem = rotacao % 360 === 0 ? imagem : desenharImagemRotacionada(imagem, rotacao);

    const proporcao = areaRecortePx.height / areaRecortePx.width;
    let largura = Math.min(Math.round(areaRecortePx.width), larguraMaxima);

    for (let tentativa = 0; tentativa < 4; tentativa++) {
        const altura = Math.round(largura * proporcao);

        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;

        const contexto = canvas.getContext("2d");
        contexto.fillStyle = "#fff"; // evita fundo preto caso a área ultrapasse a imagem
        contexto.fillRect(0, 0, largura, altura);
        contexto.drawImage(origem, areaRecortePx.x, areaRecortePx.y, areaRecortePx.width, areaRecortePx.height, 0, 0, largura, altura);

        for (const qualidade of [0.9, 0.8, 0.7, 0.6]) {
            const blob = await canvasParaBlob(canvas, qualidade);
            if (!tamanhoMaximoBytes || blob.size <= tamanhoMaximoBytes) return blob;
        }

        largura = Math.round(largura * 0.8);
    }

    throw new Error("Não foi possível reduzir a imagem recortada para o tamanho máximo permitido.");
}
