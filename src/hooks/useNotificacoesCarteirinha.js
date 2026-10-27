import { useCallback, useEffect, useRef, useState } from "react";
import { buscarStatusCarteirinha } from "../services/familiaService";
import { EVENTO_CARTEIRINHA_PENDENTE, listarCarteirinhasPendentes, adicionarCarteirinhaPendente, removerCarteirinhaPendente } from "../utils/carteirinhasPendentes";

const INTERVALO_POLLING_MS = 3000;
const DURACAO_SUCESSO_MS = 5000;
const DURACAO_ERRO_MS = 8000;
const DURACAO_SAIDA_MS = 300;

const STATUS_EM_ANDAMENTO = "PROCESSANDO";
const STATUS_ERRO = ["ERRO", "FALHA", "FALHOU"];

const MSG_PROCESSANDO = "Processamento da carteirinha em andamento...";
const MSG_SUCESSO_PADRAO = "Carteirinha gerada com sucesso!";
const MSG_ERRO_PADRAO = "Não foi possível gerar a carteirinha.";
const MSG_TEMPO_ESGOTADO = "Não foi possível acompanhar o processamento da carteirinha.";
const TEMPO_MAXIMO_ACOMPANHAMENTO_MS = 10 * 60 * 1000;

const msgSucesso = (nome) => (nome ? `A carteirinha da família do(a) ${nome} foi criada com sucesso!` : MSG_SUCESSO_PADRAO);
const msgErro = (nome, detalhe) => {
    const base = nome ? `Houve um erro ao processar a carteirinha da família do(a) ${nome}.` : MSG_ERRO_PADRAO;
    return detalhe ? `${base} ${detalhe}` : base;
};

const notificacaoEmAndamento = ({ id }) => ({ id, tipo: "processando", msg: MSG_PROCESSANDO, saindo: false });

/**
 * Notificações do processamento das carteirinhas.
 *
 * Os correlationId pendentes vêm do sessionStorage (gravados no cadastro da família), então
 * continuam aparecendo depois do redirecionamento e de recarregar a página. Enquanto houver
 * algum em andamento, consulta o backend de 3 em 3 segundos; ao receber o resultado, a notificação
 * vira verde (sucesso) ou vermelha (erro), some com um fade e o id sai do sessionStorage.
 */
export function useNotificacoesCarteirinha({ aoConcluir } = {}) {
    const [notificacoes, setNotificacoes] = useState(() => listarCarteirinhasPendentes().map(notificacaoEmAndamento));
    const timers = useRef(new Set());
    const aoConcluirRef = useRef(aoConcluir);

    useEffect(() => {
        aoConcluirRef.current = aoConcluir;
    }, [aoConcluir]);

    const idsEmAndamento = notificacoes
        .filter((n) => n.tipo === "processando")
        .map((n) => n.id)
        .join(",");

    // Começa a acompanhar uma carteirinha pedida depois que a tela já abriu (o listener abaixo cria a notificação).
    const acompanhar = useCallback((id) => adicionarCarteirinhaPendente(id), []);

    useEffect(() => {
        const aoAdicionar = (evento) => {
            const id = evento.detail;
            setNotificacoes((atuais) => (atuais.some((n) => n.id === id) ? atuais : [...atuais, notificacaoEmAndamento({ id })]));
        };

        window.addEventListener(EVENTO_CARTEIRINHA_PENDENTE, aoAdicionar);
        return () => window.removeEventListener(EVENTO_CARTEIRINHA_PENDENTE, aoAdicionar);
    }, []);

    const remover = useCallback((id) => {
        setNotificacoes((atuais) => atuais.filter((n) => n.id !== id));
    }, []);

    const agendar = useCallback((acao, tempo) => {
        const timer = setTimeout(() => {
            timers.current.delete(timer);
            acao();
        }, tempo);
        timers.current.add(timer);
    }, []);

    const fechar = useCallback(
        (id) => {
            setNotificacoes((atuais) => atuais.map((n) => (n.id === id ? { ...n, saindo: true } : n)));
            agendar(() => remover(id), DURACAO_SAIDA_MS);
        },
        [agendar, remover]
    );

    const concluir = useCallback(
        (id, tipo, msg) => {
            removerCarteirinhaPendente(id);
            setNotificacoes((atuais) => atuais.map((n) => (n.id === id ? { ...n, tipo, msg } : n)));
            aoConcluirRef.current?.(tipo);
            agendar(() => fechar(id), tipo === "erro" ? DURACAO_ERRO_MS : DURACAO_SUCESSO_MS);
        },
        [agendar, fechar]
    );

    useEffect(() => {
        if (!idsEmAndamento) return;

        const ids = idsEmAndamento.split(",");
        let ativo = true;
        let timer;

        const verificar = async (id) => {
            const resultado = await buscarStatusCarteirinha(id);

            if (!ativo) return;

            const { status, message, mensagem = message, nomeResponsavel } = resultado?.status === 200 ? (resultado.dados ?? {}) : {};
            const statusNormalizado = String(status ?? "").toUpperCase();

            if (statusNormalizado && statusNormalizado !== STATUS_EM_ANDAMENTO) {
                if (STATUS_ERRO.includes(statusNormalizado)) {
                    concluir(id, "erro", msgErro(nomeResponsavel, mensagem));
                } else {
                    concluir(id, "sucesso", msgSucesso(nomeResponsavel));
                }
                return;
            }

            // Ainda em andamento (ou falha na consulta, como 404/5xx): só desiste depois do prazo máximo,
            // para a notificação não sumir à toa.
            const criadoEm = listarCarteirinhasPendentes().find((item) => item.id === id)?.criadoEm ?? Date.now();

            if (Date.now() - criadoEm > TEMPO_MAXIMO_ACOMPANHAMENTO_MS) {
                concluir(id, "erro", MSG_TEMPO_ESGOTADO);
            }
        };

        // Espera a rodada terminar antes de agendar a próxima, para as consultas não se acumularem.
        const ciclo = async () => {
            await Promise.all(ids.map(verificar));
            if (ativo) timer = setTimeout(ciclo, INTERVALO_POLLING_MS);
        };

        ciclo();

        return () => {
            ativo = false;
            clearTimeout(timer);
        };
    }, [idsEmAndamento, concluir]);

    useEffect(() => {
        const pendentes = timers.current;
        return () => pendentes.forEach(clearTimeout);
    }, []);

    return { notificacoes, fechar, acompanhar };
}
