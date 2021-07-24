import { Fragment, useState, useEffect } from "react";
import useData from "init";
import { useReadUser } from "api/frequent";
import BuyGamesCard from "./buy-games-card/BuyGamesCard";

export default function BuyGamesList({ currComp, setComp }) {
    const [triggerList, setTriggerList] = useState("");
    const { userId } = useData();
    const allGamesList = [];

    const { data, loading } = useReadUser(
        userId,
        "cliente-admin",
        `clientAdminData.games`,
        {
            trigger: triggerList || userId, // triggerList is an random id
        }
    );

    if (loading && !data) {
        return (
            <p className="my-5 hidden-content--root text-normal text-purple font-weight-bold">
                Verificando jogos de compras...
            </p>
        );
    }

    let allAvailableGamesCount = 0;
    const gamesFromDb = data.clientAdminData.games;
    Object.keys(gamesFromDb).forEach((gameName) => {
        if (!gamesFromDb || typeof gamesFromDb[gameName].on !== "boolean")
            return;
        if (gamesFromDb[gameName].on) allAvailableGamesCount += 1;
        allGamesList.push({
            gameName,
            ...gamesFromDb[gameName],
        });
    });

    // cli-admin is not allowed to disable all games.
    const needBlockDisableNextGame = allAvailableGamesCount === 1;

    return (
        <section className="hidden-content--root text-normal">
            <section className="container">
                <div className="row">
                    {allGamesList.map((thisData) => {
                        // NOT WORKING - need update challList without having to click on the game card
                        if (triggerList && currComp === "targetPrize")
                            setComp({
                                name: thisData.gameName,
                                props: {
                                    setTriggerList,
                                    loading,
                                    setComp,
                                    needBlockDisableNextGame,
                                },
                            });

                        return (
                            <Fragment key={thisData.gameName}>
                                <BuyGamesCard
                                    gameData={thisData}
                                    setTriggerList={setTriggerList}
                                    loading={loading}
                                    setComp={setComp}
                                    needBlockDisableNextGame={
                                        needBlockDisableNextGame
                                    }
                                />
                            </Fragment>
                        );
                    })}
                </div>
            </section>
        </section>
    );
}
