import { Fragment, useState } from "react";
import useData from "init";
import { useReadUser } from "api/frequent";
import BuyGamesCard from "./buy-games-card/BuyGamesCard";
import GeneralTweaksBtn from "./_general-tweaks/GeneralTweaksBtn";

export default function BuyGamesList({ setComp, isDigitalMenu }) {
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
    const gamesFromDb = data && data.clientAdminData.games;
    Object.keys(gamesFromDb).forEach((gameName) => {
        const onlyOnlineGames = ["discountBack"];

        const onlyAllowed = isDigitalMenu
            ? onlyOnlineGames
            : ["targetPrize", "discountBack", "balloonPop"];
        const isAllowedGame = onlyAllowed.includes(gameName);
        if (
            !isAllowedGame ||
            !gamesFromDb ||
            typeof gamesFromDb[gameName].on !== "boolean"
        )
            return;
        if (gamesFromDb[gameName].on) allAvailableGamesCount += 1;
        allGamesList.push({
            gameName,
            ...gamesFromDb[gameName],
        });
    });

    const showSubtitle = () => {
        if (isDigitalMenu) {
            return (
                <p
                    className="text-grey text-normal text-sm-left text-center"
                    style={{ fontWeight: "normal" }}
                >
                    Ofereça benefícios automatizados nos pedidos dos clientes.
                    Eles participam direto do seu menu digital.
                </p>
            );
        }

        return (
            <p
                className="text-grey text-normal text-sm-left text-center"
                style={{ fontWeight: "normal" }}
            >
                você pode ativar um ou mais jogos e oferecer diferentes
                benefícios aos seus clientes
            </p>
        );
    };

    return (
        <section className="hidden-content--root text-normal">
            {!isDigitalMenu && (
                <div className="my-5 container-center">
                    <GeneralTweaksBtn />
                </div>
            )}
            <h2 className="my-5 font-weight-bold text-subtitle text-center text-purple">
                Galeria de Jogos
                <br />
                {showSubtitle()}
            </h2>
            <section className="container">
                <div className="row">
                    {allGamesList.map((thisData) => (
                        <Fragment key={thisData.gameName}>
                            <BuyGamesCard
                                gameData={thisData}
                                setTriggerList={setTriggerList}
                                loading={loading}
                                setComp={setComp}
                            />
                        </Fragment>
                    ))}
                </div>
            </section>
        </section>
    );
}
