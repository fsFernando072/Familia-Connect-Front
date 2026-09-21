import { CLASSE_LABEL, CLASSE_INPUT } from '../estilosCampo';

function CampoSelect({ label, value, onChange, opcoes, placeholder = 'Selecionar' }) {
    return (
        <div>
            <label className={CLASSE_LABEL}>{label}</label>
            <select
                value={value}
                onChange={onChange}
                className={CLASSE_INPUT}
            >
                <option value=''>{placeholder}</option>
                {opcoes.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                ))}
            </select>
        </div>
    );
}

export default CampoSelect;
