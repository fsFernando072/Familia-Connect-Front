import CampoTexto from "../CampoTexto/CampoTexto";
import { CLASSE_LABEL, CLASSE_INPUT } from "../estilosCampo";

function CampoProfissao({ label, profissoes, selecionada, onChangeSelecionada, nova, onChangeNova }) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className={CLASSE_LABEL}>{label}</label>
                <select
                    value={selecionada}
                    onChange={onChangeSelecionada}
                    className={CLASSE_INPUT}
                >
                    <option value="">Sem profissão</option>
                    {profissoes.map((p) => (
                        <option key={p.id} value={p.nome}>{p.nome}</option>
                    ))}
                    <option value="outra">Outra</option>
                </select>
            </div>

            {selecionada === "outra" && (
                <CampoTexto
                    label="Nome da Nova Profissão"
                    value={nova}
                    onChange={onChangeNova}
                    placeholder="Digite a profissão"
                />
            )}
        </div>
    );
}

export default CampoProfissao;
