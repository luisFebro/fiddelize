import { useState, useEffect, Fragment } from "react";
import useScrollUp from "hooks/scroll/useScrollUp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import CommentField from "components/fields/CommentField";
import { setItems } from "init/lStorage";
import { Load } from "components/code-splitting/LoadableComp";
import convertToReal from "utils/numbers/convertToReal";
import useContext from "context";
// import showToast from "components/toasts";
import getId from "utils/getId";
import { ReturnBtn } from "../OrdersCart";
import OrdersMenuTable from "./OrdersMenuTable";

export const AsyncExternalOrderForm = Load({
    loader: () =>
        import(
            "../external-order-form/ExternalOrderForm" /* webpackChunkName: "external-order-comp-lazy" */
        ),
});

export default function OrdersPage({
    setCatalogData,
    setNextPage,
    itemList,
    itemsCount,
    investAmount,
    adminId,
    placeId,
    customerId,
    socket,
    isOnline,
    didBeatGame,
}) {
    useScrollUp();
    const {
        customerPoints,
        currGame,
        adminGame,
        bizLinkName,
        loginData,
    } = useContext();

    const customerEmail = loginData && loginData.email;
    const [customerNote, setCustomerNote] = useState("");

    const allPoints = Number(investAmount) + Number(customerPoints || 0);
    useEffect(() => {
        if (!currGame) return;
        const did = !adminGame ? false : allPoints >= adminGame.targetPoints;
        if (did) setCatalogData((prev) => ({ ...prev, didBeatGame: true }));
    }, [allPoints, currGame]);

    const [data, setData] = useState({
        openExternalOrder: false,
    });
    const { openExternalOrder } = data;

    const showTitle = () => (
        <div className="my-3">
            <p className="main-font text-em-1-9 text-white text-center font-weight-bold">
                Meu Pedido
                <br />
                <span className="d-block text-center font-weight-bold position-relative mx-3 text-normal">
                    Confira os itens adicionados.
                </span>
            </p>
        </div>
    );

    const runSuccessOrder = (dataOrder = {}) => {
        const { customerName, customerPhone, customerAddress } = dataOrder;

        // marketing and promotion data
        const gamesData = handleGamesData({
            currGame,
            customerPoints,
            totalAmount: investAmount,
            adminGame, // all data related to admin game
        });

        const body = {
            customerId,
            customerName,
            customerPhone,
            customerAddress,
            customerNote,
            customerEmail: customerEmail || "visitante",
            placeId,
            adminId,
            order: {
                stage: "queue",
                totalCount: itemsCount,
                totalAmount: investAmount,
                orderList: itemList,
            },
            games: {
                ...gamesData,
            },
        };

        if (socket) {
            socket.emit("updateCustomerOrder", body);
            socket.emit("updateAdminList");
            socket.emit("getAdminListCount", { adminId });
        }

        setItems("global", {
            digitalMenuData: {
                [bizLinkName]: {
                    orderCount: itemsCount,
                    orderAmount: investAmount,
                    orderList: itemList,
                },
            },
            digitalMenuCurrPage: "success",
        });
        setNextPage("success");
    };

    const showCustomerNote = () => (
        <div className="mt-5">
            <h2 className="text-normal mx-3 text-white">
                Alguma observação do pedido? (opcional)
            </h2>
            <CommentField
                setValue={setCustomerNote}
                value={customerNote}
                placeholder=""
                rows={2}
                maxLen={200}
                maxLenColor="white"
            />
        </div>
    );

    const showDoneOrderBtn = () => (
        <section className="container-center mt-3">
            <ButtonFab
                title="Confirmar e Pedir"
                backgroundColor="var(--themeSDark--default)"
                onClick={() => {
                    if (isOnline)
                        return setData((prev) => ({
                            ...prev,
                            openExternalOrder: getId(),
                        }));
                    return runSuccessOrder();
                }}
                position="relative"
                variant="extended"
                size="large"
            />
        </section>
    );

    return (
        <section>
            <ReturnBtn setNextPage={setNextPage} />
            {showTitle()}
            {didBeatGame && (
                <PromoArea
                    currGame={currGame}
                    adminGame={adminGame}
                    needShowPromo
                />
            )}
            <OrdersMenuTable
                setData={setCatalogData}
                investAmount={investAmount}
                discountAmount={
                    didBeatGame && adminGame && adminGame.targetMoney
                }
                itemList={itemList}
                itemsCount={itemsCount}
                removeVar={() => null}
                setNextPage={setNextPage}
                currGame={currGame}
                adminGame={adminGame}
                needShowPromo={didBeatGame}
            />
            {showCustomerNote()}
            {showDoneOrderBtn()}
            {isOnline && openExternalOrder && (
                <AsyncExternalOrderForm
                    setMainData={setData}
                    runSuccessOrder={runSuccessOrder}
                />
            )}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}

function PromoArea({ currGame, adminGame, needShowPromo }) {
    const discountBackPromo = () => {
        const targetMoney = adminGame && adminGame.targetMoney;
        const targetPoints = adminGame && adminGame.targetPoints;

        return (
            <Fragment>
                {needShowPromo && (
                    <Fragment>
                        <h1 className="text-center text-subtitle font-weight-bold text-white text-shadow">
                            Desconto Retornado
                        </h1>
                        <p className="my-3 text-white text-shadow text-center text-normal font-weight-bold">
                            Neste pedido, você ganha
                            <br />
                            <span
                                className="text-pill text-shadow"
                                style={{ background: "var(--themePLight)" }}
                            >
                                R$ {convertToReal(targetMoney)} de desconto
                            </span>{" "}
                            porque acumulou {targetPoints} pontos.
                        </p>
                    </Fragment>
                )}
            </Fragment>
        );
    };

    return (
        <section className="promo-area my-3">
            {currGame === "discountBack" && discountBackPromo()}
            <style jsx>
                {`
                    .promo-area {
                        background-color: var(--themePDark);
                        border-radius: 15px;
                    }
                `}
            </style>
        </section>
    );
}

// HELPERS
function handleGamesData({ currGame, adminGame, customerPoints, totalAmount }) {
    if (!currGame) return null;
    if (currGame === "discountBack") {
        const allPoints = Number(totalAmount) + Number(customerPoints || 0);
        return {
            currGame,
            discountBack: {
                orderPoints: totalAmount,
                priorPoints: customerPoints,
                allPoints: Number(totalAmount) + Number(customerPoints),
                didBeatGame: !adminGame
                    ? false
                    : allPoints >= adminGame.targetPoints,
                ...adminGame,
                // ...adminGame:
                // targetPoints
                // targetMoney
                // perc
            },
        };
    }

    return null;
}
// END HELPERS
