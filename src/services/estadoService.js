import { buscarLista } from "./servicoBase";

export const buscarEstados = () => buscarLista("/estados", "estados");
