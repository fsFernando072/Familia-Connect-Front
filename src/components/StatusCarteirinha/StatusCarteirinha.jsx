import { IdCard } from "lucide-react";
import Botao from "../Botao/Botao";
import Selo from "../Selo/Selo";
import { COR_TURQUESA } from "../../utils/cores";

// Informa se a família possui carteirinha e oferece o botão de criação.
// `carregando`: consultando o back. `criando`: geração em andamento (polling).
function StatusCarteirinha({ possuiCarteirinha = false, carregando = false, criando = false, aoCriar }) {
    if (carregando) return <p className="text-sm text-cifa-apagado">Verificando carteirinha...</p>;

    const selo = criando ? "Gerando carteirinha..." : possuiCarteirinha ? "Possui carteirinha" : "Sem carteirinha";
    const tom = possuiCarteirinha && !criando ? "ativo" : "pendente";
    const texto = criando ? "Aguarde, a carteirinha está sendo gerada." : possuiCarteirinha ? "Esta família já possui uma carteirinha emitida." : "Esta família ainda não possui carteirinha.";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
                <Selo texto={selo} tom={tom} />
                <p className="text-sm text-cifa-apagado">{texto}</p>
            </div>

            {!possuiCarteirinha && <Botao nome={criando ? "Gerando..." : "Criar Carteirinha"} icone={IdCard} cor={COR_TURQUESA} acao={aoCriar} desabilitado={criando} larguraBotao="w-full sm:w-auto" />}
        </div>
    );
}

export default StatusCarteirinha;
