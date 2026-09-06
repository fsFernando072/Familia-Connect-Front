const COLUNAS = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
};

function CartaoInfo({ colunas = 2, children }) {
    return (
        <div className={`grid grid-cols-1 ${COLUNAS[colunas] || COLUNAS[2]} gap-x-8 gap-y-2 bg-white border border-gray-800 rounded-md p-4`}>
            {children}
        </div>
    );
}

export default CartaoInfo;
