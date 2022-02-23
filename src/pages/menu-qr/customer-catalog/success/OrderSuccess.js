import { Fragment, useEffect, useState } from "react";
import { setItems } from "init/lStorage";
import getDayGreetingBr from "utils/getDayGreetingBr";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import convertToReal from "utils/numbers/convertToReal";
import showToast from "components/toasts";
import ModalYesNo from "components/modals/ModalYesNo";
import { useHistory } from "react-router-dom";
import ProgressTrack from "./ProgressTrack";
import NotifActivationZone from "./notif/NotifActivationZone";
import useContext from "context";

const isSmall = window.Helper.isSmallScreen();

export default function OrderSuccess({
    allDataItem,
    socket,
    ids,
    bizLinkName,
    didBeatGame,
}) {
    const [currStage, setCurrStage] = useState("queue");
    const [openCancel, setOpenCancel] = useState(false);
    // 3 stages of order: queue, preparing, done
    const placeId = ids && ids.placeId;
    const disconnected = socket && socket.disconnected;

    useEffect(() => {
        if (disconnected) socket.connect();
        // eslint-disable-next-line
    }, [disconnected]);

    useEffect(() => {
        if (!socket) return;
        socket.on("setNewOrderStage", ({ newStage }) => {
            setCurrStage(newStage);
        });

        // update current stage
        socket.emit("readCustomerSingleOrder", {
            ids,
            isCurrStage: true,
            field: "order.stage",
            onlySender: true,
        });
        socket.on("updateCurrStage", ({ currStage }) => {
            setCurrStage(currStage);
        });
    }, [socket]);

    const finishOrder = (isCancel) => {
        socket.disconnect();
        setItems("global", {
            digitalMenuCurrPage: "menu",
            digitalMenuData: {},
        });
        if (isCancel) {
            showToast("Pedido cancelado com sucesso!", { type: "success" });
            setCurrStage("canceled");
        }
    };

    useEffect(() => {
        if (currStage === "done") finishOrder();
    }, [currStage]);

    const showBackBtn = () => (
        <div className="container-center my-3">
            <ButtonFab
                title="Voltar"
                color="var(--mainWhite)"
                onClick={() => {
                    window.location.href =
                        placeId && placeId.includes("online")
                            ? `/${bizLinkName}/menu`
                            : `/${bizLinkName}/menu/${placeId}`;
                }}
                backgroundColor="var(--themeSDark)"
                variant="extended"
                position="relative"
                size="medium"
            />
        </div>
    );

    const showCancelBtn = () => (
        <div className="mx-3 d-flex justify-content-end">
            <ButtonFab
                title="Cancelar"
                color="var(--mainWhite)"
                onClick={() => {
                    setOpenCancel(true);
                }}
                backgroundColor="var(--expenseRed)"
                variant="extended"
                position="relative"
                size="medium"
            />
            {showBackBtn()}
        </div>
    );

    const showEndZone = () => {
        if (currStage === "canceled") return <div />;

        return (
            <Fragment>
                {currStage === "done" ? (
                    <Fragment>
                        <div className="mx-3 my-5 text-white text-subtitle font-weight-bold text-center">
                            Agradecemos sua preferência e volte sempre!
                        </div>
                        {showBackBtn()}
                    </Fragment>
                ) : (
                    <NotifActivationZone
                        ids={ids}
                        socket={socket}
                        bizLinkName={bizLinkName}
                    />
                )}
            </Fragment>
        );
    };

    if (currStage === null) {
        return (
            <div className="my-5 text-white font-weight-bold text-subtitle text-center">
                Link Inválido. Visite-nos!
            </div>
        );
    }

    const allowCancelStages = ["queue", "preparing"];
    return (
        <section className="text-shadow">
            <h2 className="mt-3 text-center text-subtitle text-white font-weight-bold">
                {getDayGreetingBr()}!
            </h2>
            <ProgressTrack stage={currStage} />
            {allDataItem && allDataItem.orderCount && (
                <MyOrder allDataItem={allDataItem} didBeatGame={didBeatGame} />
            )}
            {allowCancelStages.includes(currStage) && showCancelBtn()}
            {showEndZone()}
            {openCancel && (
                <ModalYesNo
                    title="Tem certeza que deseja cancelar seu pedido atual?"
                    subTitle=""
                    fullOpen={openCancel}
                    setFullOpen={setOpenCancel}
                    actionFunc={() => {
                        // set canceled to db order
                        const dataCancel = {
                            ...ids,
                            "order.stage": "canceled",
                        };
                        if (socket) {
                            socket.emit("updateCustomerOrder", dataCancel);
                            socket.emit("updateAdminList");
                        }

                        return finishOrder(true);
                    }}
                />
            )}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}

// COMP
function MyOrder({ allDataItem, didBeatGame }) {
    const { orderList = [], orderAmount, orderCount } = allDataItem;
    const {
        customerPoints,
        currGame,
        adminGame,
        bizLinkName,
        loginData,
    } = useContext();

    const targetMoney = adminGame && adminGame.targetMoney;

    const needShowPromo = didBeatGame;

    const handleTotalOrder = (investAmount) => {
        if (needShowPromo) {
            if (currGame === "discountBack") {
                return investAmount - targetMoney;
            }
        }

        return investAmount;
    };

    const showTitle = () => (
        <h2 className="text-subtitle text-center font-weight-bold my-3">
            Meu pedido
        </h2>
    );

    const showList = () => (
        <section className="ml-4 mr-2 text-purple text-normal">
            {orderList.length &&
                orderList.map((item) => (
                    <section className="mt-3" key={item.adName}>
                        <FontAwesomeIcon
                            icon="check"
                            className="mr-3"
                            style={{
                                fontSize: "25px",
                            }}
                        />
                        <span className="font-weight-bold">{item.count} x</span>{" "}
                        {item.adName} por{" "}
                        <span className="font-weight-bold">
                            {convertToReal(item.amount, { moneySign: true })}
                        </span>
                    </section>
                ))}
            <hr className="lazer-purple" />
            <p className="text-subtitle font-weight-bold">
                Totais:
                <br />
                <span className="text-normal">{orderCount} itens</span>
                <br />
                {didBeatGame && (
                    <p className="text-normal">
                        Desconto de: -{" "}
                        {convertToReal(targetMoney, { moneySign: true })}
                    </p>
                )}
                <span className="text-normal">
                    Valor final:{" "}
                    <span
                        className="text-pill"
                        style={{ backgroundColor: "green" }}
                    >
                        {convertToReal(handleTotalOrder(orderAmount), {
                            moneySign: true,
                        })}
                    </span>
                </span>
            </p>
            <div className="mb-5" />
        </section>
    );

    return (
        <Card
            className="mt-5 mb-2 card-elevation"
            style={{
                margin: "auto",
                width: "90%",
                maxWidth: isSmall ? "" : 360,
                textShadow: "none",
            }}
            elevation={undefined}
        >
            <section className="text-normal text-purple">
                {showTitle()}
                {showList()}
            </section>
        </Card>
    );
}
// END COMP
