import { useEffect, useState } from "react";
import { buscarEstados } from "../services/estadoService";
import { buscarProfissoes } from "../services/profissaoService";
import { buscarGrausParentesco } from "../services/grauParentescoService";

// Carrega de uma vez as listas que o formulário de família usa nos selects
// (antes, Cadastro e Editar tinham cada um o seu useEffect para isso).
export function useOpcoesFamilia() {
    const [opcoes, setOpcoes] = useState({
        estados: [],
        profissoes: [],
        grausParentesco: [],
        carregando: true,
    });

    useEffect(() => {
        let ativo = true;

        Promise.all([buscarEstados(), buscarProfissoes(), buscarGrausParentesco()])
            .then(([estados, profissoes, grausParentesco]) => {
                if (!ativo) return;
                setOpcoes({
                    estados: estados || [],
                    profissoes: profissoes || [],
                    grausParentesco: grausParentesco || [],
                    carregando: false,
                });
            });

        return () => { ativo = false; };
    }, []);

    return opcoes;
}
