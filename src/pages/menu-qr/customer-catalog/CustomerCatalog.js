import { Fragment, useState, useEffect } from "react";
import QrCode from "components/QrCode";
import CarouselCard from "components/carousels/CarouselCard";
import { Load } from "components/code-splitting/LoadableComp";
import showToast from "components/toasts";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import getItems, { setItems } from "init/lStorage";
import useAPI, { getUserIdByName } from "api/useAPI";
import getId from "utils/getId";
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

export const AsyncOrderSuccess = Load({
    loader: () =>
        import(
            "./success/OrderSuccess" /* webpackChunkName: "order-success-lazy" */
        ),
});

const [digitalMenuData, digitalMenuCurrPage] = getItems("global", [
    "digitalMenuData",
    "digitalMenuCurrPage",
]);
const randomId = getId();

export default function CustomerCatalog({ match }) {
    const [nextPage, setNextPage] = useState("menu");
    const [data, setData] = useState({
        orderCount: 0,
        orderAmount: 0,
        orderList: [],
    });
    const { orderList, orderAmount, orderCount } = data;

    const placeId = match && match.params && match.params.placeId;
    const bizLinkName = match && match.params && match.params.bizLinkId;
    const bizLogo = "/img/test/restaurant.jpg";
    const width = 110;
    const height = 110;
    const url = match && match.url;
    const isQrDisplay = placeId === "qr";
    // show either qr code to be scanned or the product catalog

    const params = {
        role: "cliente-admin",
        bizLinkName,
        // only for request auth
        nT: true,
        _id: randomId,
    };

    const { data: adminId, gotError } = useAPI({
        url: getUserIdByName(),
        params,
    });

    useEffect(() => {
        if (!digitalMenuCurrPage) return;

        setNextPage(digitalMenuCurrPage);
        setData(digitalMenuData);
    }, [digitalMenuCurrPage]);

    const setDefault = () => {
        setData((prev) => ({
            ...prev,
            orderCount: 0,
            orderAmount: 0,
            orderList: [],
        }));
    };

    useScrollUp();
    useBackColor("var(--themeBackground--default)");

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
        // even not id, at least allow to save data and keep current page
        setItems("global", {
            digitalMenuData: data,
            digitalMenuCurrPage: "menu",
        });
        if (gotError)
            return showToast(
                "Uma informação não foi carregada. Reinicie a página e verifique sua conexão."
            );

        if (!orderAmount)
            return showToast("Menu Vazio! Por favor, selecione algum item.");

        setItems("global", {
            digitalMenuData: data,
            digitalMenuCurrPage: "orders",
        });
        return setNextPage("orders");
    };

    const showLogo = () => (
        <div className="mt-2 mb-3 container-center">
            <img
                src={bizLogo}
                width={width}
                height={height}
                title={`logo da ${bizLinkName}`}
                alt={`logo empresa ${bizLinkName}`}
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
                    {nextPage === "menu" && (
                        <DigitalMenu
                            handleNextPage={handleNextPage}
                            orderAmount={orderAmount}
                            orderCount={orderCount}
                            itemData={itemData}
                        />
                    )}
                    {nextPage === "orders" && (
                        <AsyncOrdersPage
                            setNextPage={setNextPage}
                            setData={setData}
                            itemList={orderList}
                            itemsCount={orderCount}
                            investAmount={orderAmount}
                            adminId={adminId}
                            placeId={placeId}
                        />
                    )}
                    {nextPage === "success" && (
                        <AsyncOrderSuccess
                            setNextPage={setNextPage}
                            setDefault={setDefault}
                            allDataItem={data}
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
