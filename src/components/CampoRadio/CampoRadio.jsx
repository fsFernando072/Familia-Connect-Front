import { CLASSE_LABEL } from "../estilosCampo";

function CampoRadio({ label, opcoes, value, onChange, name }) {
    return (
        <div>
            <label className={CLASSE_LABEL}>{label}</label>
            <div className="flex items-center gap-6">
                {opcoes.map((opcao) => (
                    <label key={opcao} className="flex items-center gap-2 cursor-pointer text-base text-cifa-navy">
                        <input type="radio" name={name} value={opcao} checked={value === opcao} onChange={() => onChange(opcao)} className="w-4 h-4 accent-cifa-turquesa cursor-pointer" />
                        {opcao}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default CampoRadio;
