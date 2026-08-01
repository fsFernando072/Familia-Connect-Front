import { useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react';

function FeedbackToast({ tipo, msg, loading, onClose }) {

    useEffect(() => {
        if (!msg || loading) return;
        const timer = setTimeout(() => onClose(), 4000);
        return () => clearTimeout(timer);
    }, [msg, loading, onClose]);

    if (!msg && !loading) return null;

    const estilos = {
        sucesso: { bg: '#dcfce7', borda: '#16a34a', texto: '#15803d' },
        erro:    { bg: '#fee2e2', borda: '#dc2626', texto: '#b91c1c' },
        '':      { bg: '#e0f2fe', borda: '#0284c7', texto: '#0369a1' }, // loading
    };

    const { bg, borda, texto } = estilos[tipo] ?? estilos[''];

    return (
        <div className='fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md'>
            <div
                style={{ backgroundColor: bg, border: `1px solid ${borda}`, color: texto }}
                className='flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium'
            >
                {loading
                    ? <Loader2 size={18} className='animate-spin flex-shrink-0' />
                    : tipo === 'sucesso'
                        ? <CheckCircle2 size={18} className='flex-shrink-0' />
                        : <XCircle size={18} className='flex-shrink-0' />
                }
                <span className='flex-1'>{msg}</span>
                {!loading && (
                    <button onClick={onClose} className='opacity-60 hover:opacity-100 cursor-pointer flex-shrink-0'>
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default FeedbackToast;
