import { Fragment } from "react";
import useData from "init";
import BuyGamesCard from "./buy-games-card/BuyGamesCard";

export default function BuyGamesList(props) {
    const { adminGame } = useData();
    const allGamesList = [];
    let allAvailableGamesCount = 0;

    Object.keys(adminGame).forEach((gameName) => {
        if (!adminGame || typeof adminGame[gameName].on !== "boolean") return;
        if (adminGame[gameName].on) allAvailableGamesCount += 1;
        allGamesList.push({
            gameName,
            ...adminGame[gameName],
        });
    });

    // cli-admin is not allowed to disable all games.
    const needBlockDisableNextGame = allAvailableGamesCount === 1;

    return (
        <section className="hidden-content--root text-normal">
            {!allGamesList.length && (
                <p className="text-normal text-purple font-weight-bold">
                    Verificando disponíveis...
                </p>
            )}
            <section className="container">
                <div className="row">
                    {allGamesList.map((data) => (
                        <Fragment key={data.gameName}>
                            <BuyGamesCard data={data} {...props} />
                        </Fragment>
                    ))}
                </div>
            </section>
        </section>
    );
}
