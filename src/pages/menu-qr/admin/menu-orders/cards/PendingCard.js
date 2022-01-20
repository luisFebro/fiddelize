import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import NewCardPill, { checkCardNew } from "components/pills/NewCardPill";
import convertToReal from "utils/numbers/convertToReal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import getItems from "init/lStorage";
// import { useBizData } from "init";

const truncate = (name, leng) => window.Helper.truncate(name, leng);
// const [lastDate] = getItems("global", ["lastDatePendingOrderCard"]);

export default function PendingCard({ data }) {
    const orderDbUpdatedAt = new Date();
    // const { themePColor } = useBizData();
    const themePColor = "default";

    const dataItems = [
        {
            id: "123",
            qtt: 2,
            img: "/img/test/cardapio-qr/lata-guarana-antactica.jpg",
            desc: "lata guaraná antactica",
            unitAmount: 8.0,
        },
        {
            id: "456",
            qtt: 3,
            img: "/img/test/cardapio-qr/suco-de-uva.jpg",
            desc: "copos de suco de uva",
            unitAmount: 5.0,
        },
        {
            id: "789",
            qtt: 2,
            img: "/img/test/cardapio-qr/sanduba-pao-arabe-misto.png",
            desc: "sanduba pão árabe misto",
            unitAmount: 4.0,
        },
        {
            id: "1010",
            qtt: 3,
            img: "/img/test/cardapio-qr/sanduba-x-salada-verduras.jpg",
            desc: "sanduba x-salada e verduras",
            unitAmount: 7.0,
        },
    ];

    const tableId = "01";
    const orderAmount =
        dataItems && dataItems.length
            ? dataItems.reduce(
                  (acc, next) => acc + next.qtt * next.unitAmount,
                  0
              )
            : 0;
    const totalItems =
        dataItems && dataItems.length
            ? dataItems.reduce((acc, next) => acc + next.qtt, 0)
            : 0;

    const showMarkDoneBtn = () => (
        <ButtonFab
            title="Marcar"
            iconFontAwesome={
                <FontAwesomeIcon
                    icon="check"
                    style={{
                        fontSize: "20px",
                        filter: "drop-shadow(.5px .5px 1.5px grey)",
                        color: "white",
                    }}
                />
            }
            backgroundColor="var(--themeSDark)"
            onClick={null}
            position="absolute"
            top={5}
            right={5}
            variant="extended"
            size="medium"
        />
    );

    return (
        <section className="card--root mb-4 position-relative text-normal text-white text-shadow">
            {showMarkDoneBtn()}
            <h2 className="text-subtitle font-weight-bold">
                ID MESA: {tableId}
            </h2>
            <h2 className="text-normal font-weight-bold">
                Valor Total:
                <span className="ml-3 hightlight text-pill">
                    R$ {convertToReal(orderAmount, { needFraction: true })}
                </span>
            </h2>
            <p className="m-0 text-normal">
                Descrição ({totalItems} {totalItems === 1 ? "item" : "itens"}):
            </p>
            <ItemsDesc data={dataItems} />
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
            <span className="text-em-1-2 mr-1">{dt.qtt}x</span>
            <img
                src={dt.img}
                width={50}
                style={{
                    maxHeight: 60,
                }}
                alt={dt.desc}
            />
            <span className="d-table ml-2 text-white text-small d-inline-block">
                {truncate(dt.desc, 50)}
                <span
                    className="d-block ml-1 px-1"
                    style={{ background: "var(--themePLight)" }}
                >
                    R$ {convertToReal(dt.qtt * dt.unitAmount)}{" "}
                    <span className="text-small">
                        (R$ {convertToReal(dt.unitAmount)} uni.)
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
                    .map((item) => <span key={item.id}>{showItem(item)}</span>)
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
