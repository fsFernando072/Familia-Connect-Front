import { useState } from "react";
import { House } from "lucide-react";
import ItemEntrega from "../ItemEntrega/ItemEntrega";
import Selo from "../Selo/Selo";
import Botao from "../Botao/Botao";
import { COR_TURQUESA } from "../../utils/cores";

// Cartão aberto de uma família: cabeçalho (nome, selo, responsável) + painel para escolher os itens
// e confirmar a entrega. A escolha de itens fica aqui dentro: ao cancelar/fechar, ela é descartada.
function CartaoEntrega({ familia, produtos, enviando, onCancelar, onConfirmar }) {
    const [quantidades, setQuantidades] = useState({});

    const alterarQuantidade = (idProduto, quantidade) => setQuantidades((atual) => ({ ...atual, [idProduto]: Math.max(0, quantidade) }));

    const itensSelecionados = produtos.map((produto) => ({ idProduto: produto.id, quantidade: quantidades[produto.id] || 0 })).filter((item) => item.quantidade > 0);

    return (
        <section className="rounded-3xl border-2 border-cifa-turquesa bg-white p-5 shadow-sm sm:p-8">
            <header className="flex items-start gap-4 sm:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cifa-suave text-cifa-turquesa sm:h-20 sm:w-20">
                    <House size={30} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <h2 className="text-xl font-extrabold uppercase tracking-tight text-cifa-navy sm:text-2xl">{familia.nomeFamilia}</h2>
                        <Selo texto="Entrega pendente" tom="pendente" />
                    </div>
                    <p className="mt-1 truncate">
                        <span className="font-semibold text-cifa-apagado">Responsável: </span>
                        <span className="text-cifa-navy">{familia.nomeResponsavel}</span>
                    </p>
                </div>

                <button type="button" onClick={onCancelar} disabled={enviando} className="cursor-pointer text-base font-semibold text-cifa-apagado transition hover:text-cifa-navy disabled:cursor-not-allowed disabled:opacity-50">
                    Cancelar
                </button>
            </header>

            <div className="mt-6 rounded-2xl border border-cifa-linha bg-cifa-fundo/60 p-4 sm:p-6">
                <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-cifa-petroleo">Selecione os itens para entrega</h3>

                {produtos.length === 0 ? (
                    <p className="py-6 text-center text-cifa-apagado">Nenhum produto cadastrado.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {produtos.map((produto) => (
                            <ItemEntrega
                                key={produto.id}
                                nome={produto.nome}
                                detalhe={produto.descricao}
                                quantidade={quantidades[produto.id] || 0}
                                onAlterarQuantidade={(quantidade) => alterarQuantidade(produto.id, quantidade)}
                                desabilitado={enviando}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-5 flex justify-end">
                    <Botao nome="Confirmar e Finalizar Entrega" cor={COR_TURQUESA} desabilitado={enviando || itensSelecionados.length === 0} acao={() => onConfirmar(itensSelecionados)} />
                </div>
            </div>
        </section>
    );
}

export default CartaoEntrega;
