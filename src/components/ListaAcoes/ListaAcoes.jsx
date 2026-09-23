import { ArrowUpDown, Plus } from "lucide-react";
import CampoBusca from "../CampoBusca/CampoBusca";
import Botao from "../Botao/Botao";
import BotaoSecundario from "../BotaoSecundario/BotaoSecundario";
import { COR_MENTA } from "../../utils/cores";

function ListaAcoes({ busca, onBuscaChange, placeholderBusca, onOrdenar, onCadastrar, textoCadastrar = "Cadastrar", children }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <CampoBusca value={busca} onChange={onBuscaChange} placeholder={placeholderBusca} />
            <div className="flex flex-wrap items-center gap-3">
                <BotaoSecundario nome="Ordenar" icone={ArrowUpDown} acao={onOrdenar} />
                {children}
                <Botao nome={textoCadastrar} icone={Plus} cor={COR_MENTA} acao={onCadastrar} />
            </div>
        </div>
    );
}

export default ListaAcoes;
