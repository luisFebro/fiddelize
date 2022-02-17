import { Fragment, useEffect, useState } from "react";
import { setItems } from "init/lStorage";
import getDayGreetingBr from "utils/getDayGreetingBr";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import convertToReal from "utils/numbers/convertToReal";
import showToast from "components/toasts";
import ModalYesNo from "components/modals/ModalYesNo";
import ProgressTrack from "./ProgressTrack";
import NotifActivationZone from "./notif/NotifActivationZone";

const isSmall = window.Helper.isSmallScreen();

export default function OrderSuccess({
    allDataItem,
    socket,
    ids,
    bizLinkName,
}) {
    const [currStage, setCurrStage] = useState("queue");
    const [openCancel, setOpenCancel] = useState(false);
    // 3 stages of order: queue, preparing, done

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
        });
        if (isCancel) {
            showToast("Pedido cancelado com sucesso!", { type: "success" });
            setCurrStage("canceled");
        }
    };

    useEffect(() => {
        if (currStage === "done") finishOrder();
    }, [currStage]);

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
        </div>
    );

    const showEndZone = () => {
        if (currStage === "canceled") return <div />;

        return (
            <Fragment>
                {currStage === "done" ? (
                    <div className="mx-3 my-5 text-white text-subtitle font-weight-bold text-center">
                        Agradecemos sua preferência e volte sempre!
                    </div>
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
                <MyOrder allDataItem={allDataItem} />
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
function MyOrder({ allDataItem }) {
    const { orderList = [], orderAmount, orderCount } = allDataItem;

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
                <span className="text-normal">
                    Valor final:{" "}
                    <span
                        className="text-pill"
                        style={{ backgroundColor: "green" }}
                    >
                        {convertToReal(orderAmount, { moneySign: true })}
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
