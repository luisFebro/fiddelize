import useData from "init";
import GameList from "./games-list/GameList";

export default function GamesGalleryContent(props) {
    const { currPoints } = useData();

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

    const showBalance = () => (
        <h2 className="mt-4 mb-3 text-center text-purple text-normal font-weight-bold">
            Saldo Atual:
            <div className="container-center">
                <span className="d-block text-pill">{currPoints} pontos</span>
            </div>
        </h2>
    );

    return (
        <section className="mx-3">
            {showTitle()}
            {showBalance()}
            <GameList {...props} />
        </section>
    );
}
