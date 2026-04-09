function Loading({ mensagem = "Carregando..." }) {
    return (
        <div className="loading-container">
            <div className="loading-spinner-box">
                <div className="loading-spinner"></div>
                <p className="loading-texto">{mensagem}</p>
            </div>
        </div>
    );
}

export default Loading;

