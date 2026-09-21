import Botao from '../Botao/Botao';
import CampoTexto from '../CampoTexto/CampoTexto';
import CampoCheckbox from '../CampoCheckbox/CampoCheckbox';
import CampoRadio from '../CampoRadio/CampoRadio';
import CampoSelect from '../CampoSelect/CampoSelect';
import CampoProfissao from '../CampoProfissao/CampoProfissao';
import UploadImagem from '../UploadImagem/UploadImagem';
import { CLASSE_LABEL, CLASSE_INPUT } from '../estilosCampo';

function renderCampo(campo) {
    switch (campo.tipo) {
        case 'checkbox':
            return (
                <CampoCheckbox
                    label={campo.label}
                    opcoes={campo.opcoes}
                    valoresSelecionados={campo.value}
                    onChange={campo.onChange}
                />
            );
        case 'radio':
            return (
                <CampoRadio
                    label={campo.label}
                    name={campo.name}
                    opcoes={campo.opcoes}
                    value={campo.value}
                    onChange={campo.onChange}
                />
            );
        case 'select':
            return (
                <CampoSelect
                    label={campo.label}
                    value={campo.value}
                    onChange={campo.onChange}
                    opcoes={campo.opcoes}
                    placeholder={campo.placeholder}
                />
            );
        case 'profissao':
            return (
                <CampoProfissao
                    label={campo.label}
                    profissoes={campo.profissoes}
                    selecionada={campo.selecionada}
                    onChangeSelecionada={campo.onChangeSelecionada}
                    nova={campo.nova}
                    onChangeNova={campo.onChangeNova}
                />
            );
        case 'imagem':
            return (
                <UploadImagem
                    label={campo.label}
                    setImagem={campo.setImagem}
                    imagemInicial={campo.imagemInicial}
                />
            );
        case 'textarea':
            return (
                <div>
                    <label className={CLASSE_LABEL}>{campo.label}</label>
                    <textarea
                        value={campo.value}
                        onChange={campo.onChange}
                        rows={campo.rows || 9}
                        placeholder={campo.placeholder}
                        className={`${CLASSE_INPUT} resize-none`}
                    />
                    {campo.ajuda && <span className='text-xs text-cifa-apagado mt-1 block'>{campo.ajuda}</span>}
                </div>
            );
        case 'select-com-acao':
            return (
                <div>
                    <label className={CLASSE_LABEL}>{campo.label}</label>
                    <div className='flex gap-2 items-center'>
                        <select
                            value={campo.value ?? ""}
                            onChange={campo.onChange}
                            className={`${CLASSE_INPUT} flex-1 min-w-0`}
                        >
                            <option value="">Selecionar</option>
                            {campo.opcoes.map((item) => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                        {campo.acao && (
                            <Botao nome={campo.acao.nome} cor={campo.acao.cor} acao={campo.acao.onClick} />
                        )}
                    </div>
                </div>
            );
        case 'custom':
            return campo.render();
        case 'texto':
        default:
            return (
                <CampoTexto
                    label={campo.label}
                    type={campo.type}
                    value={campo.value}
                    onChange={campo.onChange}
                    onBlur={campo.onBlur}
                    placeholder={campo.placeholder}
                    toggle={campo.toggle}
                    mostrar={campo.mostrar}
                    erro={campo.erro}
                />
            );
    }
}

function Formulario({
    campos = [],
    colunas = 1,
    nomeBotao,
    corBotao,
    acaoBotao,
    larguraBotao = 'w-full sm:w-auto',
    alinhamentoBotao = 'start',
    botaoVoltar,
}) {
    const duasColunas = colunas === 2;
    const camposColuna1 = duasColunas ? campos.filter((campo) => (campo.coluna ?? 1) === 1) : campos;
    const camposColuna2 = duasColunas ? campos.filter((campo) => campo.coluna === 2) : [];
    const temRodape = Boolean(nomeBotao || botaoVoltar);

    const alinhamentos = {
        start: "sm:justify-start",
        end: "sm:justify-end",
        center: "justify-center",
        between: "justify-between",
    };

    // Busca a classe inteira ou usa uma padrão caso não encontre
    const posicaoBotao = alinhamentos[alinhamentoBotao] || "justify-center";

    const rodape = temRodape && (
        <div
            className={`mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center ${
                posicaoBotao
            }`}
        >
            {botaoVoltar && (
                <button
                    type='button'
                    onClick={botaoVoltar.onClick}
                    className='text-cifa-apagado font-semibold hover:text-cifa-navy hover:underline cursor-pointer text-center sm:text-left'
                >
                    {botaoVoltar.nome || 'Voltar'}
                </button>
            )}
            {nomeBotao && (
                <Botao nome={nomeBotao} cor={corBotao} acao={acaoBotao} larguraBotao={larguraBotao} />
            )}
        </div>
    );

    return (
        <div className={duasColunas ? 'w-full overflow-hidden' : `w-full ${campos.length > 0 ? 'max-w-md' : ''}`}>
            <div className={duasColunas ? 'grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4' : ''}>
                <div className='flex flex-col gap-4 min-w-0'>
                    {camposColuna1.map((campo) => (
                        <div key={campo.id}>{renderCampo(campo)}</div>
                    ))}
                </div>

                {duasColunas && camposColuna2.length > 0 && (
                    <div className='flex flex-col gap-4 min-w-0'>
                        {camposColuna2.map((campo) => (
                            <div key={campo.id}>{renderCampo(campo)}</div>
                        ))}
                    </div>
                )}
            </div>

            {rodape}
        </div>
    );
}

export default Formulario;
