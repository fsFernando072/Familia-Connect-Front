import { buscarLista } from "./servicoBase";

export const buscarGrausParentesco = () => buscarLista("/grau-parentescos", "graus de parentesco");
