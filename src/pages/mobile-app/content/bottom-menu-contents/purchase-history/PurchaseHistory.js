import React from "react";
import parse from "html-react-parser";
import { useProfile } from "hooks/useRoleData";
import getFirstName from "utils/string/getFirstName";
import CardsList from "./cards-list/CardsList";

const isEvenSmall = window.Helper.isSmallScreen(415);

export default function PurchaseHistory({ modalData = {} }) {
    const { role } = useProfile();
    const isAdmin = role === "cliente-admin";

    const {
        cliUserName = "Febro",
        cliUserId = "601df6b42be9a28986c2a821",
        totalGeneralScore = 200,
        totalPurchasePrize = 6,
        isFromDashboard = false,
        // currUserScore,
    } = modalData;

    const getCardsListData = React.useMemo(
        () => ({
            _id: cliUserId,
            name: cliUserName,
            totalGeneralScore,
            totalPurchasePrize,
            isFromDashboard,
        }),
        [
            cliUserId,
            cliUserName,
            totalGeneralScore,
            totalPurchasePrize,
            isFromDashboard,
        ]
    );

    const cardsListData = getCardsListData();

    const mainTitle = parse(
        `&#187; Histórico de<br />Compras ${
            isAdmin ? `de ${getFirstName(cliUserName.cap())}` : ""
        }`
    );
    const showTitle = () => (
        <div
            id="form-dialog-title"
            style={{ padding: isEvenSmall ? "16px 24px 0" : "16px 24px 15px" }}
        >
            <p
                className="text-nowrap position-relative text-subtitle text-purple text-center font-weight-bold"
                style={{ margin: "0 15px", top: "15px" }}
            >
                {mainTitle}
            </p>
        </div>
    );

    return (
        <section onScroll={null}>
            {showTitle()}
            <div style={{ padding: "8px 10px", overflowX: "hidden" }}>
                <CardsList data={cardsListData} />
            </div>
        </section>
    );
}
