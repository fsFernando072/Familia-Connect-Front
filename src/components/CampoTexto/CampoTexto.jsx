import { Eye, EyeOff } from "lucide-react";
import { CLASSE_LABEL, CLASSE_INPUT, CLASSE_INPUT_ERRO } from "../estilosCampo";

function CampoTexto({ label, value, onChange, onBlur, placeholder, type = "text", erro, toggle, mostrar }) {
    return (
        <div>
            <label className={CLASSE_LABEL}>{label}</label>
            <div className="relative">
                <input type={type} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} className={erro ? CLASSE_INPUT_ERRO : CLASSE_INPUT} />
                {toggle && (
                    <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cifa-apagado hover:text-cifa-navy cursor-pointer">
                        {mostrar ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {erro && <span className="text-sm text-red-600 mt-1 block">{erro}</span>}
        </div>
    );
}

export default CampoTexto;
