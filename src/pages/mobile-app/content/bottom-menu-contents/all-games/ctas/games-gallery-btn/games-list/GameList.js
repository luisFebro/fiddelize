import { Fragment } from "react";
import useData from "init";
import GameCard from "./GameCard";

export default function GameList(props) {
    const { adminGame } = useData();
    const allGamesList = [];

    Object.keys(adminGame).forEach((gameName) => {
        const dataGame = adminGame[gameName] || {};
        if (!adminGame || typeof dataGame.on !== "boolean") return;
        allGamesList.push({
            gameName,
            ...adminGame[gameName],
        });
    });

    return (
        <section
            className="mt-5"
            style={{
                marginBottom: "150px",
            }}
        >
            {!allGamesList.length && (
                <p className="text-normal text-purple font-weight-bold">
                    Verificando disponíveis...
                </p>
            )}
            <section className="container">
                <div className="row">
                    {allGamesList.map((data) => (
                        <Fragment key={data.gameName}>
                            <GameCard data={data} {...props} />
                        </Fragment>
                    ))}
                </div>
            </section>
        </section>
    );
}
