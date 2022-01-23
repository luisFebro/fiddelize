import { useEffect } from "react";
import { removeItems } from "init/lStorage";
import getDayGreetingBr from "utils/getDayGreetingBr";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Card from "@material-ui/core/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import convertToReal from "utils/numbers/convertToReal";
import ProgressTrack from "./ProgressTrack";

const isSmall = window.Helper.isSmallScreen();

export default function OrderSuccess({
    allDataItem,
    setNextPage,
    setDefault,
    socket,
}) {
    // 3 stages of order: queue, preparing, done
    const currStage = "queue";

    const disconnected = socket && socket.disconnected;
    useEffect(() => {
        if (disconnected) socket.connect();
        // eslint-disable-next-line
    }, [disconnected]);

    useEffect(() => {
        if (currStage === "done") {
            socket.disconnect();
            removeItems("global", ["digitalMenuData", "digitalMenuCurrPage"]);
        }
    }, [currStage]);

    return (
        <section className="text-shadow">
            <h2 className="mt-3 text-center text-subtitle text-white font-weight-bold">
                {getDayGreetingBr()}!
            </h2>
            <ProgressTrack stage={currStage} />
            <MyOrder allDataItem={allDataItem} />
            {currStage === "done" ? (
                <div className="my-5 container-center">
                    <ButtonFab
                        title="Voltar Menu"
                        color="var(--mainWhite)"
                        onClick={() => {
                            setNextPage("menu");
                            setDefault();
                        }}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                        size="large"
                    />
                </div>
            ) : (
                <NotifActivationZone />
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
                    <section className="mt-3" key={item.name}>
                        <FontAwesomeIcon
                            icon="check"
                            className="mr-3"
                            style={{
                                fontSize: "25px",
                            }}
                        />
                        <span className="font-weight-bold">{item.count} x</span>{" "}
                        {item.name} por{" "}
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
            <p className="mt-2 text-center text-em-0-9 font-weight-bold text-grey">
                Agradecemos sua preferência!
            </p>
        </section>
    );

    return (
        <Card
            className="my-5 card-elevation"
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

function NotifActivationZone() {
    return (
        <section className="text-white">
            <p className="text-normal mx-3 my-5 text-center">
                Quer ser notificado quando pedido ficar pronto?
            </p>
            <div className="mt-3 container-center">
                <ButtonFab
                    title="Ativar notificações"
                    color="var(--mainWhite)"
                    onClick={null}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );
}
// END COMP
