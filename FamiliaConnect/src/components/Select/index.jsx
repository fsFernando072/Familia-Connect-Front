function Select({ listaCargos = [] }) {
    return (
        <select name="cargoId">
            <option value="">Selecione</option>
            {
                listaCargos.map((item) => {
                    return (
                        <option key={item.id} value={item.id}>
                            {item.nome}
                        </option>
                    );
                })
            }
        </select>
    );
}

export default Select;