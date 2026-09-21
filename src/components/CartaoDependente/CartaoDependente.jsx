import { Trash2 } from "lucide-react";
import BotaoIcone from "../BotaoIcone/BotaoIcone";
import Formulario from "../Formulario/Formulario";

function CartaoDependente({ campos, podeRemover, onRemover }) {
    return (
        <div className='relative bg-white border border-cifa-linha rounded-2xl p-5'>
            {podeRemover && (
                <BotaoIcone
                    icone={Trash2}
                    acao={onRemover}
                    titulo='Remover dependente'
                    className='absolute top-3 right-3'
                />
            )}
            <Formulario campos={campos} colunas={2} />
        </div>
    );
}

export default CartaoDependente;
