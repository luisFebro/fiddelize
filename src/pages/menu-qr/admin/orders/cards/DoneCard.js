import { useState, Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import convertToReal from "utils/numbers/convertToReal";
import { fromNow } from "utils/dates/dateFns";
import parse from "html-react-parser";
import ExternalOrderDataBtn from "./external-order-data/ExternalOrderDataBtn";
// import NewCardPill, { checkCardNew } from "components/pills/NewCardPill";
// import getItems from "init/lStorage";
// import { useBizData } from "init";

const truncate = (name, leng) => window.Helper.truncate(name, leng);
// const [lastDate] = getItems("global", ["lastDatePendingOrderCard"]);

export default function DoneCard({ data }) {
    // const { themePColor } = useBizData();

    const orderData = data && data.order;
    const status = orderData && orderData.stage;
    const dataItems = orderData && data.order.orderList;
    const placeId = data && data.placeId;
    const customerName = data && data.customerName;
    const customerPhone = data && data.customerPhone;
    const customerAddress = data && data.customerAddress;
    const customerEmail = data && data.customerEmail;
    // amount of points of any online game that offers that. The user use it in a single game, regardless if game changes
    const customerPoints = data && data.customerPoints;
    const customerNote = data && data.customerNote;
    const updatedAt = data && data.updatedAt;
    const totalCount = orderData && orderData.totalCount;
    const totalAmount = orderData && orderData.totalAmount;

    const showOrderStatus = () => {
        const statusBr = {
            done: { txt: "Feito", color: "green" },
            canceled: { txt: "Cancelado", color: "var(--expenseRed)" },
        };

        return (
            <div className="order-badge-status--root text-normal text-shadow text-white">
                <div
                    className="badge"
                    style={{ background: statusBr[status].color }}
                >
                    {statusBr[status].txt}
                </div>
                <style jsx>
                    {`
                        .order-badge-status--root {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                        }

                        .order-badge-status--root .badge {
                            padding: 1px 2px;
                            border-radius: 15px;
                            border: solid 2px white;
                        }
                    `}
                </style>
            </div>
        );
    };

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

    return (
        <section className="card--root mb-4 position-relative text-normal text-white text-shadow">
            {showOrderStatus()}
            <h2 className="text-normal font-weight-bold">
                ID lugar:{" "}
                <span className="position-relative">
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
            <ItemsDesc data={dataItems} />
            <h2 className="mt-2 text-normal text-center">
                Valor Total:
                <span
                    className="ml-3 hightlight text-pill"
                    style={{
                        backgroundColor: "#5e5b5b",
                    }}
                >
                    R$ {convertToReal(totalAmount, { needFraction: true })}
                </span>
            </h2>
            <h2 className="text-normal my-3">
                &#8226; Nota do cliente:
                <p
                    className={`d-table text-em-0-8 ${
                        customerNote ? "hightlight text-pill font-italic" : ""
                    }`}
                    style={{
                        backgroundColor: customerNote ? "#5e5b5b" : undefined,
                    }}
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
                        background: grey;
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
                    style={{ background: "#5e5b5b" }}
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
    const showMoreBtn = !moreItensBtnShow && listLeng >= 3;

    return (
        <section>
            {data.length &&
                data
                    .map((item) => <span key={item._id}>{showItem(item)}</span>)
                    .slice(0, showMoreBtn ? 2 : listLeng)}
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
