function carregarImagem(url) {
    return new Promise((resolve, reject) => {
        const imagem = new Image();
        imagem.addEventListener("load", () => resolve(imagem));
        imagem.addEventListener("error", (erro) => reject(erro));
        imagem.setAttribute("crossOrigin", "anonymous");
        imagem.src = url;
    });
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
    contexto.drawImage(
        imagem,
        areaRecortePx.x,
        areaRecortePx.y,
        areaRecortePx.width,
        areaRecortePx.height,
        0,
        0,
        tamanhoSaida,
        tamanhoSaida
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem recortada."))),
            "image/jpeg",
            0.9
        );
    });
}
