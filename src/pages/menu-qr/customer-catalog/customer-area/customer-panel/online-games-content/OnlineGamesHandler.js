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
    const { customerPoints, currGame, adminGame } = useContext();
    const { icon, nameBr } = getOnlineGameData(currGame);

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
            {currGame === "discountBack" && (
                <AsyncOnlineDiscountBack
                    currPoints={customerPoints}
                    adminGame={adminGame}
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

/*

{!currBenefit && (
    <p className="text-subtitle text-white text-shadow text-center font-weight-bold">
        Carregando...
    </p>
)}

 */
