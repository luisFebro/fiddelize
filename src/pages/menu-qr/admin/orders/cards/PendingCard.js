import { useState, Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import convertToReal from "utils/numbers/convertToReal";
import { fromNow } from "utils/dates/dateFns";
import parse from "html-react-parser";
import ExternalOrderDataBtn from "./external-order-data/ExternalOrderDataBtn";
import MarkBtn from "./mark-btn/MarkBtn";
// import NewCardPill, { checkCardNew } from "components/pills/NewCardPill";
// import getItems from "init/lStorage";
// import { useBizData } from "init";

const truncate = (name, leng) => window.Helper.truncate(name, leng);
// const [lastDate] = getItems("global", ["lastDatePendingOrderCard"]);

export default function PendingCard({ onlineGames, data, socket }) {
    // const { themePColor } = useBizData();
    const themePColor = "default";

    const adminId = data && data.adminId;
    const orderData = data && data.order;
    const dataItems = orderData && data.order.orderList;
    const customerId = data && data.customerId;
    const customerName = data && data.customerName;
    const customerPhone = data && data.customerPhone;
    const customerAddress = data && data.customerAddress;
    const customerPoints = data && data.customerPoints;
    const customerEmail = data && data.customerEmail;
    const customerNote = data && data.customerNote;
    const placeId = data && data.placeId;
    const updatedAt = data && data.updatedAt;
    const totalCount = orderData && orderData.totalCount;
    const totalAmount = orderData && orderData.totalAmount;

    const showMarkDoneBtn = () => (
        <MarkBtn
            socket={socket}
            adminId={adminId}
            customerId={customerId}
            placeId={placeId}
            dataItems={dataItems}
            customerEmail={customerEmail}
            totalAmount={totalAmount}
            customerPoints={customerPoints}
        />
    );

    const showUpdatedAt = () => (
        <p className="mt-2 text-white text-small">
            Atualizado em: {fromNow(updatedAt)}
        </p>
    );

    const isOnline = placeId && placeId.includes("online");
    const dataOnline = {
        customerName,
        customerPhone,
        customerAddress,
    };

    // THIS DATA SHOULD BE TRANSFERED FROM SUCCESS PAGE FROM CUSTOMER
    const currGame = onlineGames && onlineGames.currGame;
    let accumulativePoints = 0;
    const didBeatGame = true;
    const needDiscountCoupon = currGame === "discountBack" && didBeatGame;
    const targetPoints = 100;
    const targetMoney = 20;

    if (currGame === "descountBack") {
        accumulativePoints = totalAmount + customerPoints;
        // const targetPoints = adminGame && adminGame.targetPoints;
        // const customerCurrPoints = adminGame && adminGame.customerPoints || 0; // zero here is required to avoid undefined and cause error in the accumulated amount when the user has no purchases priorly
        // const accumulatedPoints = Number(customerCurrPoints) + Number(totalAmount);
        // const didBeatGame = accumulatedPoints >= targetPoints;
    }

    const handleTotalOrder = () => {
        if (needDiscountCoupon) {
            return totalAmount - targetMoney;
        }

        return totalAmount;
    };

    return (
        <section className="card--root mb-5 position-relative text-normal text-white text-shadow">
            {showMarkDoneBtn()}
            <h2 className="text-normal font-weight-bold">
                ID lugar:{" "}
                <span className="text-pill position-relative">
                    <Fragment>
                        {isOnline ? "online" : placeId}
                        {isOnline && (
                            <ExternalOrderDataBtn dataOnline={dataOnline} />
                        )}
                    </Fragment>
                </span>
            </h2>
            <h2 className="font-site text-em-0-9 font-weight-bold">
                Cliente:{" "}
                <span className="position-relative text-break">
                    {truncate(customerEmail, 25)}
                </span>
            </h2>
            <p className="m-0 mt-3 text-normal">
                &#8226; Pedido ({totalCount}{" "}
                {totalCount === 1 ? "item" : "itens"}):
            </p>
            <ItemsDesc data={dataItems} onlineGames={onlineGames} />
            {false && ( // needDiscountCoupon
                <p className="my-3 text-pill text-center text-normal font-weight-bold">
                    Vale desconto de
                    <br />
                    <span
                        className="text-pill text-shadow"
                        style={{ background: "var(--themePLight)" }}
                    >
                        R$ {convertToReal(targetMoney)}
                    </span>{" "}
                    aplicado
                    <p className="text-em-0-7 font-site font-weight-bold">
                        cliente bateu a meta de {targetPoints} pontos.
                    </p>
                </p>
            )}
            <h2 className="mt-2 my-2 text-normal text-center">
                Valor Total:
                <span className="ml-3 hightlight text-pill">
                    R${" "}
                    {convertToReal(handleTotalOrder(), { needFraction: true })}
                </span>
            </h2>
            <h2 className="text-normal my-3">
                &#8226; Nota do cliente:
                <p
                    className={`d-table text-em-0-8 ${
                        customerNote ? "hightlight text-pill font-italic" : ""
                    }`}
                >
                    {customerNote
                        ? parse(`&quot;${customerNote}&quot;`)
                        : "nenhuma"}
                </p>
            </h2>
            {showUpdatedAt()}
            <style jsx>
                {`
                    .card--root {
                        padding: 8px 12px;
                        background: var(--themePDark--${themePColor});
                        border-radius: 15px;
                    }

                    .card--root .benefits-area svg {
                        font-size: 35px;
                    }
                `}
            </style>
        </section>
    );
}

function ItemsDesc({ data }) {
    const [moreItensBtnShow, setMoreItensShow] = useState(false);

    const showItem = (dt) => (
        <div className="mt-1 d-flex align-items-center text-white text-normal">
            <span className="text-em-1-2 mr-1">{dt.count}x</span>
            <img
                src={dt.img}
                width={50}
                style={{
                    maxHeight: 60,
                }}
                alt={dt.adName}
            />
            <span className="d-table ml-2 text-white text-small d-inline-block">
                {truncate(dt.adName, 50)}
                <span
                    className="d-block ml-1 px-1"
                    style={{ background: "var(--themePLight)" }}
                >
                    R$ {convertToReal(dt.amount)}{" "}
                    <span className="text-small">
                        (R$ {convertToReal(dt.amount / dt.count)} uni.)
                    </span>
                </span>
            </span>
        </div>
    );

    const listLeng = data && data.length;
    const showMoreBtn = !moreItensBtnShow && listLeng >= 4;

    return (
        <section>
            {data.length &&
                data
                    .map((item) => <span key={item._id}>{showItem(item)}</span>)
                    .slice(0, showMoreBtn ? 3 : listLeng)}
            {showMoreBtn && (
                <div className="container-center my-2">
                    <ButtonFab
                        title="mostrar mais"
                        titleSize="small"
                        backgroundColor="var(--themeSDark)"
                        onClick={() => setMoreItensShow(true)}
                        position="relative"
                        variant="extended"
                        size="small"
                    />
                </div>
            )}
        </section>
    );
}
