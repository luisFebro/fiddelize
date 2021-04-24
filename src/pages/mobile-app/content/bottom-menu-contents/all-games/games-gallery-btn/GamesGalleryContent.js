export default function GamesGalleryContent() {
    const showTitle = () => (
        <div className="mt-3 text-center text-purple mx-3">
            <h1 className="text-subtitle font-weight-bold">Jogos de Compra</h1>
            <h2
                className="text-normal"
                style={{
                    lineHeight: "25px",
                }}
            >
                Ganhe saldo em pontos a cada compra. Participe de qualquer jogo
                disponível.
            </h2>
        </div>
    );

    return <section>{showTitle()}</section>;
}
