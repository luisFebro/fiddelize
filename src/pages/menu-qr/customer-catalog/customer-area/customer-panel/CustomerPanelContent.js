import { useEffect, useState, Fragment } from "react";
import useContext from "context";
import { Load } from "components/code-splitting/LoadableComp";

export const AsyncOnlineDiscountBack = Load({
    loader: () =>
        import(
            "./online-games-content/OnlineDiscountBack" /* webpackChunkName: "online-game-content-lazy" */
        ),
});

export function getCustomerGameData({
    socket,
    callback,
    adminId,
    email,
    currGame,
}) {
    socket.emit("readCustomerProfile", {
        adminId,
        email,
    });
    socket.on("readCustomerProfile", ({ dataCustomerProfile }) => {
        const customerData =
            dataCustomerProfile && dataCustomerProfile.clientUserData;
        const gameData =
            customerData &&
            customerData.onlineGames &&
            customerData.onlineGames[currGame];
        callback(gameData);
    });
}

export default function CustomerPanelContent() {
    const [currBenefit, setCurrBenefit] = useState(null);
    const { currGame, socket, loginData, adminId } = useContext();
    const email = loginData && loginData.email;
    const gotBenefit = Boolean(currGame);

    useEffect(() => {
        if (!socket) return;
        getCustomerGameData({
            socket,
            currGame,
            adminId,
            email,
            callback: (data) => setCurrBenefit(data),
        });
    }, [adminId, email, currGame]);

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-white text-shadow text-center font-weight-bold">
                Painel do Cliente
            </p>
        </div>
    );

    const handleGameContent = () => (
        <Fragment>
            {!currBenefit && (
                <p className="text-subtitle text-white text-shadow text-center font-weight-bold">
                    Carregando...
                </p>
            )}
            {currGame === "discountBack" && (
                <AsyncOnlineDiscountBack
                    currPoints={currBenefit && currBenefit.currPoints}
                />
            )}
        </Fragment>
    );

    return (
        <section>
            {showTitle()}
            {!gotBenefit ? (
                <p className="text-subtitle text-white text-shadow text-center font-weight-bold">
                    Em breve
                </p>
            ) : (
                handleGameContent()
            )}
        </section>
    );
}
