import { ArrowUpDown, Plus } from "lucide-react";
import CampoBusca from "../CampoBusca/CampoBusca";
import Botao from "../Botao/Botao";
import BotaoSecundario from "../BotaoSecundario/BotaoSecundario";

function ListaAcoes({ busca, onBuscaChange, placeholderBusca, onOrdenar, onCadastrar, textoCadastrar = "Cadastrar", children }) {
    return (
        <div className='flex items-center gap-3 mb-6'>
            <CampoBusca value={busca} onChange={onBuscaChange} placeholder={placeholderBusca} />
            <BotaoSecundario nome='Ordenar' icone={ArrowUpDown} acao={onOrdenar} />
            {children}
            <Botao nome={textoCadastrar} icone={Plus} cor='#34C759' acao={onCadastrar} />
        </div>
    );
}

export default ListaAcoes;
