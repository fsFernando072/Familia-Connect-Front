import { buscarLista } from "./servicoBase";

export const buscarProfissoes = () => buscarLista("/profissoes", "profissões");
