import { Fragment, useState, useEffect } from "react";
import { Load } from "components/code-splitting/LoadableComp";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import useContext from "context";
import { getCustomerGameData } from "../CustomerPanelContent";

export const AsyncOnlineDiscountBack = Load({
    loader: () =>
        import(
            "./OnlineDiscountBack" /* webpackChunkName: "online-game-content-lazy" */
        ),
});

export default function OnlineGamesHandler() {
    const [currBenefit, setCurrBenefit] = useState(null);
    const { currGame, socket, loginData, adminId } = useContext();
    const email = loginData && loginData.email;
    const { icon, nameBr } = getOnlineGameData(currGame);

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

    const showPromotionTitle = () => (
        <section className="animated fadeIn py-4">
            <h2 className="text-subtitle font-weight-bold text-center text-white text-shadow">
                {icon}
                {nameBr}
            </h2>
        </section>
    );

    return (
        <Fragment>
            {showPromotionTitle()}
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
}

// HELPERS
function getOnlineGameData(currGame) {
    if (currGame === "discountBack") {
        return {
            nameBr: "Desconto Retornado",
            icon: <LoyaltyIcon className="mr-2" style={{ fontSize: 45 }} />,
        };
    }
    return {};
}
// END HELPERS
