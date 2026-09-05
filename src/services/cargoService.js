import api from "./apiClient";

const ACESSOS = {
    CADASTRAR_FAMILIAS: 1,
    CADASTRAR_AUDITORIAS: 2,
    CADASTRAR_FUNCIONARIOS: 3,
    CADASTRAR_PRODUTOS: 4,
    CADASTRAR_ENTREGAS: 5,
    CADASTRAR_ACESSOS: 6,
    CADASTRAR_CATEGORIAS: 7,
    CADASTRAR_CARGOS: 8,
    CADASTRAR_PROFISSOES: 9,
    CADASTRAR_ESTOQUES: 10,

    EDITAR_PRODUTOS: 11,
    EDITAR_AUDITORIAS: 12,
    EDITAR_FAMILIAS: 13,
    EDITAR_FUNCIONARIOS: 14,
    EDITAR_ENTREGAS: 15,
    EDITAR_ACESSOS: 16,
    EDITAR_CARGOS: 17,
    EDITAR_PROFISSOES: 18,
    EDITAR_CATEGORIAS: 19,
    EDITAR_ESTOQUES: 20,

    EXCLUIR_FAMILIAS: 21,
    EXCLUIR_AUDITORIAS: 22,
    EXCLUIR_CATEGORIAS: 23,
    EXCLUIR_PRODUTOS: 24,
    EXCLUIR_FUNCIONARIOS: 25,
    EXCLUIR_ENTREGAS: 26,
    EXCLUIR_ACESSOS: 27,
    EXCLUIR_CARGOS: 28,
    EXCLUIR_PROFISSOES: 29,
    EXCLUIR_ESTOQUES: 30,

    LISTAR_FAMILIAS: 31,
    LISTAR_CATEGORIAS: 32,
    LISTAR_AUDITORIAS: 33,
    LISTAR_FUNCIONARIOS: 34,
    LISTAR_ENTREGAS: 35,
    LISTAR_PRODUTOS: 36,
    LISTAR_ACESSOS: 37,
    LISTAR_CARGOS: 38,
    LISTAR_PROFISSOES: 39,
    LISTAR_ESTOQUES: 40,
    VISUALIZAR_ARQUIVOS: 41,
};

export const PERMISSOES_CARGO = [

    {
        id: ACESSOS.CADASTRAR_FAMILIAS,
        acessoId: ACESSOS.CADASTRAR_FAMILIAS,
        nome: "Cadastrar famílias"
    },
    {
        id: ACESSOS.CADASTRAR_AUDITORIAS,
        acessoId: ACESSOS.CADASTRAR_AUDITORIAS,
        nome: "Cadastrar auditorias"
    },
    {
        id: ACESSOS.CADASTRAR_FUNCIONARIOS,
        acessoId: ACESSOS.CADASTRAR_FUNCIONARIOS,
        nome: "Cadastrar funcionários"
    },
    {
        id: ACESSOS.CADASTRAR_PRODUTOS,
        acessoId: ACESSOS.CADASTRAR_PRODUTOS,
        nome: "Cadastrar produtos"
    },
    {
        id: ACESSOS.CADASTRAR_ENTREGAS,
        acessoId: ACESSOS.CADASTRAR_ENTREGAS,
        nome: "Cadastrar entregas"
    },
    {
        id: ACESSOS.CADASTRAR_ACESSOS,
        acessoId: ACESSOS.CADASTRAR_ACESSOS,
        nome: "Cadastrar acessos"
    },
    {
        id: ACESSOS.CADASTRAR_CATEGORIAS,
        acessoId: ACESSOS.CADASTRAR_CATEGORIAS,
        nome: "Cadastrar categorias"
    },
    {
        id: ACESSOS.CADASTRAR_CARGOS,
        acessoId: ACESSOS.CADASTRAR_CARGOS,
        nome: "Cadastrar cargos"
    },
    {
        id: ACESSOS.CADASTRAR_PROFISSOES,
        acessoId: ACESSOS.CADASTRAR_PROFISSOES,
        nome: "Cadastrar profissões"
    },
    {
        id: ACESSOS.CADASTRAR_ESTOQUES,
        acessoId: ACESSOS.CADASTRAR_ESTOQUES,
        nome: "Cadastrar estoques"
    },

    {
        id: ACESSOS.EDITAR_PRODUTOS,
        acessoId: ACESSOS.EDITAR_PRODUTOS,
        nome: "Editar produtos"
    },
    {
        id: ACESSOS.EDITAR_AUDITORIAS,
        acessoId: ACESSOS.EDITAR_AUDITORIAS,
        nome: "Editar auditorias"
    },
    {
        id: ACESSOS.EDITAR_FAMILIAS,
        acessoId: ACESSOS.EDITAR_FAMILIAS,
        nome: "Editar famílias"
    },
    {
        id: ACESSOS.EDITAR_FUNCIONARIOS,
        acessoId: ACESSOS.EDITAR_FUNCIONARIOS,
        nome: "Editar funcionários"
    },
    {
        id: ACESSOS.EDITAR_ENTREGAS,
        acessoId: ACESSOS.EDITAR_ENTREGAS,
        nome: "Editar entregas"
    },
    {
        id: ACESSOS.EDITAR_ACESSOS,
        acessoId: ACESSOS.EDITAR_ACESSOS,
        nome: "Editar acessos"
    },
    {
        id: ACESSOS.EDITAR_CARGOS,
        acessoId: ACESSOS.EDITAR_CARGOS,
        nome: "Editar cargos"
    },
    {
        id: ACESSOS.EDITAR_PROFISSOES,
        acessoId: ACESSOS.EDITAR_PROFISSOES,
        nome: "Editar profissões"
    },
    {
        id: ACESSOS.EDITAR_CATEGORIAS,
        acessoId: ACESSOS.EDITAR_CATEGORIAS,
        nome: "Editar categorias"
    },
    {
        id: ACESSOS.EDITAR_ESTOQUES,
        acessoId: ACESSOS.EDITAR_ESTOQUES,
        nome: "Editar estoques"
    },

    {
        id: ACESSOS.EXCLUIR_FAMILIAS,
        acessoId: ACESSOS.EXCLUIR_FAMILIAS,
        nome: "Excluir famílias"
    },
    {
        id: ACESSOS.EXCLUIR_AUDITORIAS,
        acessoId: ACESSOS.EXCLUIR_AUDITORIAS,
        nome: "Excluir auditorias"
    },
    {
        id: ACESSOS.EXCLUIR_CATEGORIAS,
        acessoId: ACESSOS.EXCLUIR_CATEGORIAS,
        nome: "Excluir categorias"
    },
    {
        id: ACESSOS.EXCLUIR_PRODUTOS,
        acessoId: ACESSOS.EXCLUIR_PRODUTOS,
        nome: "Excluir produtos"
    },
    {
        id: ACESSOS.EXCLUIR_FUNCIONARIOS,
        acessoId: ACESSOS.EXCLUIR_FUNCIONARIOS,
        nome: "Excluir funcionários"
    },
    {
        id: ACESSOS.EXCLUIR_ENTREGAS,
        acessoId: ACESSOS.EXCLUIR_ENTREGAS,
        nome: "Excluir entregas"
    },
    {
        id: ACESSOS.EXCLUIR_ACESSOS,
        acessoId: ACESSOS.EXCLUIR_ACESSOS,
        nome: "Excluir acessos"
    },
    {
        id: ACESSOS.EXCLUIR_CARGOS,
        acessoId: ACESSOS.EXCLUIR_CARGOS,
        nome: "Excluir cargos"
    },
    {
        id: ACESSOS.EXCLUIR_PROFISSOES,
        acessoId: ACESSOS.EXCLUIR_PROFISSOES,
        nome: "Excluir profissões"
    },
    {
        id: ACESSOS.EXCLUIR_ESTOQUES,
        acessoId: ACESSOS.EXCLUIR_ESTOQUES,
        nome: "Excluir estoques"
    },


    {
        id: ACESSOS.LISTAR_FAMILIAS,
        acessoId: ACESSOS.LISTAR_FAMILIAS,
        nome: "Listar famílias"
    },
    {
        id: ACESSOS.LISTAR_CATEGORIAS,
        acessoId: ACESSOS.LISTAR_CATEGORIAS,
        nome: "Listar categorias"
    },
    {
        id: ACESSOS.LISTAR_AUDITORIAS,
        acessoId: ACESSOS.LISTAR_AUDITORIAS,
        nome: "Listar auditorias"
    },
    {
        id: ACESSOS.LISTAR_FUNCIONARIOS,
        acessoId: ACESSOS.LISTAR_FUNCIONARIOS,
        nome: "Listar funcionários"
    },
    {
        id: ACESSOS.LISTAR_ENTREGAS,
        acessoId: ACESSOS.LISTAR_ENTREGAS,
        nome: "Listar entregas"
    },
    {
        id: ACESSOS.LISTAR_PRODUTOS,
        acessoId: ACESSOS.LISTAR_PRODUTOS,
        nome: "Listar produtos"
    },
    {
        id: ACESSOS.LISTAR_ACESSOS,
        acessoId: ACESSOS.LISTAR_ACESSOS,
        nome: "Listar acessos"
    },
    {
        id: ACESSOS.LISTAR_CARGOS,
        acessoId: ACESSOS.LISTAR_CARGOS,
        nome: "Listar cargos"
    },
    {
        id: ACESSOS.LISTAR_PROFISSOES,
        acessoId: ACESSOS.LISTAR_PROFISSOES,
        nome: "Listar profissões"
    },
    {
        id: ACESSOS.LISTAR_ESTOQUES,
        acessoId: ACESSOS.LISTAR_ESTOQUES,
        nome: "Listar estoques"
    },
    {
        id: ACESSOS.VISUALIZAR_ARQUIVOS,
        acessoId: ACESSOS.VISUALIZAR_ARQUIVOS,
        nome: "Visualizar arquivos"
    },
];


// Busca o nome amigável de um acesso (ex.: "Cadastrar famílias") a partir do seu id.
export function nomeAcessoPorId(acessoId) {
    const permissao = PERMISSOES_CARGO.find((p) => p.acessoId === Number(acessoId));
    return permissao?.nome;
}

export async function buscarCargo() {
    try {
        const response = await api.get("/cargos");

        if (response.status === 200) {
            return response.data;
        }

        if (response.status === 204) {
            console.log("Nenhum cargo encontrado.");
            return [];
        }

        if (response.status === 401) {
            console.log("Não autorizado.");
        }

        return null;

    } catch (error) {
        console.error("Erro:", error);
        return null;
    }
}


export async function listarCargos() {
    try {
        const response = await api.get("/cargos");

        if (response.status === 200) {
            return response.data;
        }

        return [];

    } catch (error) {
        console.error("Erro ao buscar cargos:", error);
        return [];
    }
}


export async function buscarCargoPorId(id) {
    try {
        const response = await api.get(`/cargos/${id}`);

        if (response.status === 200) {
            return response.data;
        }

        return null;

    } catch (error) {
        console.error("Erro ao buscar cargo:", error);
        return null;
    }
}


export async function deletarCargo(id) {
    try {
        const response = await api.delete(`/cargos/${id}`);

        return response.status === 204;

    } catch (error) {
        console.error("Erro ao apagar cargo:", error);
        return false;
    }
}


export async function listarCargosAcessos() {
    try {
        const response = await api.get("/cargos-acessos");

        if (response.status === 200) {
            return response.data;
        }

        return [];

    } catch (error) {
        console.error("Erro ao buscar acessos dos cargos:", error);
        return [];
    }
}


export async function cadastrarCargo(
    nome,
    descricao,
    idsPermissoesSelecionadas,
    navigate,
    setFeedback
) {

    if (!nome.trim()) {
        setFeedback({
            tipo: "erro",
            msg: "O nome do cargo é obrigatório.",
            loading: false
        });
        return;
    }

    setFeedback({
        tipo: "",
        msg: "Cadastrando cargo...",
        loading: true
    });

    try {

        const response = await api.post("/cargos", {
            nome: nome.trim(),
            descricao: descricao.trim()
        });

        if (response.status !== 201) {

            if (response.status === 401) {
                setFeedback({
                    tipo: "erro",
                    msg: "Ação não autorizada.",
                    loading: false
                });
            } else {
                setFeedback({
                    tipo: "erro",
                    msg: "Não foi possível cadastrar o cargo.",
                    loading: false
                });
            }

            return;
        }

        const novoCargoId = response.data.id;

        if (idsPermissoesSelecionadas?.length > 0) {

            const resultados = await Promise.allSettled(
                idsPermissoesSelecionadas.map((acessoId) =>
                    api.post("/cargos-acessos", {
                        cargoId: Number(novoCargoId),
                        acessoId: Number(acessoId)
                    })
                )
            );

            // Verifica se algum acesso falhou
            const houveErro = resultados.some(
                (resultado) => resultado.status === "rejected"
            );

            if (houveErro) {

                setFeedback({
                    tipo: "erro",
                    msg: "O cargo foi cadastrado, mas alguns acessos não puderam ser associados.",
                    loading: false
                });

                return;
            }
        }

        setFeedback({
            tipo: "sucesso",
            msg: "Cargo cadastrado com sucesso!",
            loading: false
        });

        setTimeout(() => navigate("/cargos"), 2000);

    } catch (error) {

        console.error("Erro ao cadastrar cargo:", error);

        setFeedback({
            tipo: "erro",
            msg: "Erro de conexão. Não foi possível cadastrar o cargo.",
            loading: false
        });
    }
}


export async function atualizarCargo(
    id,
    nome,
    descricao,
    idsPermissoesSelecionadas,
    associacoesAtuais,
    navigate,
    setFeedback
) {

    if (!nome.trim()) {
        setFeedback({
            tipo: "erro",
            msg: "O nome do cargo é obrigatório.",
            loading: false
        });
        return;
    }

    setFeedback({
        tipo: "",
        msg: "Atualizando cargo...",
        loading: true
    });

    try {

        // 1. Atualiza o nome e descrição do cargo
        const response = await api.put(`/cargos/${id}`, {
            nome: nome.trim(),
            descricao: descricao.trim()
        });

        if (response.status !== 200) {

            if (response.status === 404) {
                setFeedback({
                    tipo: "erro",
                    msg: "Cargo não encontrado.",
                    loading: false
                });

            } else if (response.status === 401) {
                setFeedback({
                    tipo: "erro",
                    msg: "Ação não autorizada.",
                    loading: false
                });

            } else {
                setFeedback({
                    tipo: "erro",
                    msg: "Não foi possível atualizar o cargo.",
                    loading: false
                });
            }

            return;
        }

        const idsAtuais = associacoesAtuais.map(
            (associacao) => Number(associacao.acesso?.id)
        );

        const paraAdicionar = idsPermissoesSelecionadas.filter(
            (acessoId) => !idsAtuais.includes(Number(acessoId))
        );

        const paraRemover = associacoesAtuais.filter(
            (associacao) =>
                !idsPermissoesSelecionadas.includes(
                    Number(associacao.acesso?.id)
                )
        );


        const inclusoes = paraAdicionar.map((acessoId) =>
            api.post("/cargos-acessos", {
                cargoId: Number(id),
                acessoId: Number(acessoId)
            })
        );


        const exclusoes = paraRemover.map((associacao) =>
            api.delete(`/cargos-acessos/${associacao.id}`)
        );


        const resultados = await Promise.allSettled([
            ...inclusoes,
            ...exclusoes
        ]);


        const houveErro = resultados.some(
            (resultado) => resultado.status === "rejected"
        );


        if (houveErro) {

            setFeedback({
                tipo: "erro",
                msg: "O cargo foi atualizado, mas alguns acessos não puderam ser alterados.",
                loading: false
            });

            return;
        }


        setFeedback({
            tipo: "sucesso",
            msg: "Cargo atualizado com sucesso!",
            loading: false
        });

        setTimeout(() => navigate("/cargos"), 2000);

    } catch (error) {

        console.error("Erro ao atualizar cargo:", error);

        setFeedback({
            tipo: "erro",
            msg: "Erro de conexão. Não foi possível atualizar o cargo.",
            loading: false
        });
    }
}