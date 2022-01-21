import { Fragment, useState } from "react";
import QrCode from "components/QrCode";
import CarouselCard from "components/carousels/CarouselCard";
import { Load } from "components/code-splitting/LoadableComp";
import showToast from "components/toasts";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import { ContinueBtn, TotalInvest } from "./OrdersCart";
import ProductCard from "./ProductCard";
import {
    updateItem,
    removeItem,
    useOrderTotal,
} from "./helpers/customerOrderMethods";

export const AsyncOrdersPage = Load({
    loader: () =>
        import(
            "./orders-page/OrdersPage" /* webpackChunkName: "orders-page-lazy" */
        ),
});

export default function CustomerCatalog({ match }) {
    const [nextPage, setNextPage] = useState(false);
    const [data, setData] = useState({
        orderCount: 0,
        orderAmount: 0,
        orderList: [],
    });
    const { orderList, orderAmount, orderCount } = data;

    useScrollUp();
    useBackColor("var(--themeBackground--default");

    const handleItem = (action, payload) => {
        const actions = ["update", "remove"];
        if (!actions.includes(action))
            throw new Error(`Invalid action. Only ${actions}`);
        const isUpdate = action === "update";

        if (isUpdate) updateItem({ ...payload, setData });
        else removeItem({ itemName: payload, setData });
    };
    useOrderTotal({ orderCount, orderList, setData });

    const itemData = {
        handleItem,
        orderList,
    };

    const handleNextPage = () => {
        if (!orderAmount)
            return showToast("Menu Vazio! Por favor, selecione algum item.");
        return setNextPage(true);
    };

    const orderId = match && match.params && match.params.orderId;
    const bizLinkId = match && match.params && match.params.bizLinkId;
    const bizLogo = "/img/test/restaurant.jpg";
    const width = 110;
    const height = 110;
    const url = match && match.url;
    const isQrDisplay = orderId === "qr";
    // show either qr code to be scanned or the product catalog

    const showLogo = () => (
        <div className="mt-5 mb-3 container-center">
            <img
                src={bizLogo}
                width={width}
                height={height}
                title={`logo da ${bizLinkId}`}
                alt={`logo empresa ${bizLinkId}`}
            />
        </div>
    );

    const showQrCode = () => {
        const imageSettings = {
            src: bizLogo,
        };

        const imageSquare = true; // bizLogo && bizLogo.includes("h_100,w_100");

        return (
            <section className="mb-5 container-center">
                <div className="qr-container">
                    <QrCode
                        value={`https:/fiddelize.com.br/${url}`}
                        fgColor="var(--themeP--purple)"
                        imageSettings={imageSettings}
                        imageSquare={imageSquare}
                    />
                </div>
            </section>
        );
    };

    return (
        <section>
            {showLogo()}
            {isQrDisplay ? (
                <Fragment>
                    <h1 className="font-weight-bold mt-5 text-subtitle text-white text-center">
                        Peça seu pedido:
                    </h1>
                    {showQrCode()}
                </Fragment>
            ) : (
                <Fragment>
                    {!nextPage ? (
                        <DigitalMenu
                            handleNextPage={handleNextPage}
                            orderAmount={orderAmount}
                            orderCount={orderCount}
                            itemData={itemData}
                        />
                    ) : (
                        <AsyncOrdersPage
                            setNextPage={setNextPage}
                            setData={setData}
                            itemList={orderList}
                            itemsCount={orderCount}
                            investAmount={orderAmount}
                        />
                    )}
                </Fragment>
            )}
        </section>
    );
}

// COMP
function DigitalMenu({ handleNextPage, orderAmount, orderCount, itemData }) {
    const allCategories = ["bebidas", "sanduíches", "gerais"];
    const dataProducts = [
        {
            id: "123",
            category: "bebidas",
            availableQtt: 10,
            img: "/img/test/cardapio-qr/lata-guarana-antactica.jpg",
            desc: "lata guaraná antactica",
            unitAmount: 8.0,
        },
        {
            id: "123fsf",
            category: "bebidas",
            availableQtt: 10,
            img: "/img/test/cardapio-qr/suco-de-uva.jpg",
            desc: "suco de uva",
            unitAmount: 5,
        },
        {
            id: "123fsq232f",
            category: "bebidas",
            availableQtt: 30,
            img: "/img/test/cardapio-qr/coca.jpg",
            desc:
                "coca-cola ma bebida muito gelada, gelada mesmo meu deus, precisa beber essa bebida miraculosa    ",
            unitAmount: 8,
        },
        {
            id: "123fsq232f",
            category: "sanduíches",
            availableQtt: 3,
            img: "/img/test/cardapio-qr/kikao.jpg",
            desc: "kikão com palha",
            unitAmount: 5,
        },
        {
            id: "12321233",
            category: "sanduíches",
            availableQtt: 15,
            img: "/img/test/cardapio-qr/sanduba-x-salada-verduras.jpg",
            desc: "sanduba x-salada muito top",
            unitAmount: 5,
        },
        {
            id: "12321233132",
            category: "sanduíches",
            availableQtt: 5,
            img: "/img/test/cardapio-qr/sanduba-pao-arabe-misto.png",
            desc: "sanduba pão árabe",
            unitAmount: 5,
        },
    ];

    const showCatalog = () => (
        <section>
            {allCategories.map((cat) => {
                const filteredCategory =
                    dataProducts.filter((item) => item.category === cat) || [];
                if (!filteredCategory.length) return <div />;

                const ThisCardList = (
                    <CardList dataList={filteredCategory} itemData={itemData} />
                );

                return (
                    <section key={cat}>
                        <h2
                            className="d-table text-pill ml-3 text-normal text-purple font-weight-bold"
                            style={{
                                backgroundColor: "var(--themePDark)",
                            }}
                        >
                            {cat}
                        </h2>
                        <div>
                            <CarouselCard
                                CardList={ThisCardList}
                                size="large"
                                multi
                            />
                        </div>
                        <TotalInvest
                            orderAmount={orderAmount}
                            orderCount={orderCount}
                        />
                        <ContinueBtn onClick={handleNextPage} />
                    </section>
                );
            })}
        </section>
    );

    return (
        <section>
            <h1 className="font-weight-bold text-subtitle text-white text-center">
                Menu Digital
                <p className="mx-3 text-normal text-em-1-0">
                    Para adicionar um novo item, basta clicar no botão de mais.
                    Bom apetite!
                </p>
            </h1>
            {showCatalog()}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}

// COMP
function CardList({ dataList = [], itemData }) {
    return (
        <Fragment>
            {dataList.length &&
                dataList.map((card) => (
                    <Fragment key={card.id}>
                        <ProductCard card={card} itemData={itemData} />
                    </Fragment>
                ))}
        </Fragment>
    );
}
// END COMP
