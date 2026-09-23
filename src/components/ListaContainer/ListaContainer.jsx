function ListaContainer({ gap = "gap-4", children }) {
    return (
        <div className={`flex flex-col ${gap}`}>
            {children}
        </div>
    );
}

export default ListaContainer;
