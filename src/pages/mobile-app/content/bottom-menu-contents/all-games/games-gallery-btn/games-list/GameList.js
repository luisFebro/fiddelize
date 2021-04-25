import { Fragment } from "react";
import GameCard from "./GameCard";

export default function GameList({ setMainData = () => null }) {
    const availableGames = [
        {
            name: "targetPrize",
        },
        {
            name: "discountBack",
            data: "discountGoal:30.50;discountPerc:5;",
        },
    ];
    const error = false;

    if (error) {
        return (
            <p className="text-subtitle text-red font-weight-bold mx-3 my-5">
                Um erro aconteceu ao iniciar a sessão. Tente abrir novamente.
            </p>
        );
    }

    return (
        <section
            className="mt-5"
            style={{
                marginBottom: "150px",
            }}
        >
            {!availableGames && (
                <p className="text-normal text-purple font-weight-bold">
                    Verificando disponíveis...
                </p>
            )}
            <section className="container">
                <div className="row">
                    {availableGames &&
                        availableGames.map((game) => (
                            <Fragment key={game.name}>
                                <GameCard
                                    data={game}
                                    setMainData={setMainData}
                                />
                            </Fragment>
                        ))}
                </div>
            </section>
        </section>
    );
}
