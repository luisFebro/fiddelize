import parse from "html-react-parser";
import CardsList from "./cards-list/CardsList";
import { useProfile } from "init";
import getFirstName from "../../../utils/string/getFirstName";

const isEvenSmall = window.Helper.isSmallScreen(415);

export default function AsyncPurchaseHistory({ modalData }) {
    const { role } = useProfile();
    const isAdmin = role === "cliente-admin";

    const {
        cliUserName,
        cliUserId,
        // currUserScore,
        totalGeneralScore,
        totalPurchasePrize,
        isFromDashboard = false,
    } = modalData;

    const getCardsListData = () => ({
        _id: cliUserId,
        name: cliUserName,
        totalGeneralScore,
        totalPurchasePrize,
        isFromDashboard,
    });
    const cardsListData = getCardsListData();

    const isCartEmpty = !totalGeneralScore;

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

/*
const handleScroll = id => {
    const elem = document.querySelector(id);
    if(elem) {
        const rect = elem.getBoundingClientRect();
        const y = parseInt(rect.y);
        if(y < 123) {
            setHideRaceCart(true);
        } else {
            setHideRaceCart(false);
        }
    }
}

const showHeaderBar = () => (
    !isCartEmpty && (
        <section className="px-2 purchase-history-table-data--root text-normal text-center text-purple font-weight-bold">
            <div className="desc text-left">DESCRIÇÃO</div>
            <div className="score">PONTOS/R$</div>
        </section>
    )
);
 */
