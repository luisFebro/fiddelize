import { Fragment, useState, useEffect } from "react";
import { useBizData } from "init";
import CarouselCard from "components/carousels/CarouselCard";
import { Load } from "components/code-splitting/LoadableComp";
import showToast from "components/toasts";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import getItems, { setItems, removeItems } from "init/lStorage";
import removeImgFormat from "utils/biz/removeImgFormat";
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

export default function CustomerCatalog({
    adminId,
    placeId,
    customerId,
    bizLinkName,
    socket,
    isUsedLink,
    isOnline,
    // url,
}) {
    const [nextPage, setNextPage] = useState("menu");
    const [data, setData] = useState({
        orderCount: 0,
        orderAmount: 0,
        orderList: [],
    });
    const { orderList, orderAmount, orderCount } = data;

    const { bizLogo } = useBizData();
    const { newImg: thisbizLogo, width, height } = removeImgFormat(bizLogo);

    const ids = {
        adminId,
        placeId,
        customerId,
    };

    const gotSavedMenuData = digitalMenuData && digitalMenuData.orderCount;
    useEffect(() => {
        if (gotSavedMenuData) setData(digitalMenuData);
        // if it is a used link, then remain in the menu page and ignore local db
        if (digitalMenuCurrPage === "orders") return setNextPage("orders");
        if (!isUsedLink) setNextPage("menu");
        else setNextPage("success");
    }, [gotSavedMenuData, isUsedLink]);

    const setDefault = async () => {
        await setData((prev) => ({
            ...prev,
            orderCount: 0,
            orderAmount: 0,
            orderList: [],
        }));
        removeItems("global", ["digitalMenuData", "digitalMenuCurrPage"]);
        if (window) window.location.reload();
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
        if (!adminId)
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
                src={thisbizLogo}
                width={width}
                height={height}
                title={`logo da ${bizLinkName}`}
                alt={`logo empresa ${bizLinkName}`}
            />
        </div>
    );

    // if(!loaded) {
    //     return(
    //         <p
    //             className="mx-3 text-center text-white text-shadow text-subtitle"
    //             style={{
    //                 margin: "150px 0"
    //             }}
    //         >
    //             Carregando Menu Digital...
    //         </p>
    //     )
    // }

    const showPages = () => (
        <Fragment>
            {nextPage === "menu" && (
                <DigitalMenu
                    handleNextPage={handleNextPage}
                    orderAmount={orderAmount}
                    orderCount={orderCount}
                    itemData={itemData}
                    setDefault={setDefault}
                    isOnline={isOnline}
                />
            )}
            {nextPage === "orders" && (
                <AsyncOrdersPage
                    setNextPage={setNextPage}
                    setCatalogData={setData}
                    itemList={orderList}
                    itemsCount={orderCount}
                    investAmount={orderAmount}
                    adminId={adminId}
                    placeId={placeId}
                    customerId={customerId}
                    socket={socket}
                    isOnline={isOnline}
                />
            )}
            {nextPage === "success" && (
                <AsyncOrderSuccess
                    allDataItem={data}
                    socket={socket}
                    ids={ids}
                />
            )}
        </Fragment>
    );

    return (
        <section>
            {showLogo()}
            {showPages()}
        </section>
    );
}

// COMP
function DigitalMenu({
    setDefault,
    handleNextPage,
    orderAmount,
    orderCount,
    itemData,
    isOnline,
}) {
    const allCategories = ["bebidas", "sanduíches", "gerais"];
    const dataProducts = [
        {
            itemId: "123",
            category: "bebidas",
            availableQtt: 10,
            img: "/img/test/cardapio-qr/lata-guarana-antactica.jpg",
            name: "lata guaraná antactica",
            unitAmount: 8.0,
        },
        {
            itemId: "123fsf",
            category: "bebidas",
            availableQtt: 10,
            img: "/img/test/cardapio-qr/suco-de-uva.jpg",
            name: "suco de uva",
            unitAmount: 5,
        },
        {
            itemId: "123fsq232f",
            category: "bebidas",
            availableQtt: 30,
            img: "/img/test/cardapio-qr/coca.jpg",
            name:
                "coca-cola ma bebida muito gelada, gelada mesmo meu deus, precisa beber essa bebida miraculosa    ",
            unitAmount: 8,
        },
        {
            itemId: "123fsq232f",
            category: "sanduíches",
            availableQtt: 3,
            img: "/img/test/cardapio-qr/kikao.jpg",
            name: "kikão com palha",
            unitAmount: 5,
        },
        {
            itemId: "12321233",
            category: "sanduíches",
            availableQtt: 15,
            img: "/img/test/cardapio-qr/sanduba-x-salada-verduras.jpg",
            name: "sanduba x-salada muito top",
            unitAmount: 5,
        },
        {
            itemId: "12321233132",
            name: "sanduba pão árabe",
            category: "sanduíches",
            availableQtt: 5,
            img: "/img/test/cardapio-qr/sanduba-pao-arabe-misto.png",
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
                            setDefault={setDefault}
                        />
                        <ContinueBtn onClick={handleNextPage} />
                    </section>
                );
            })}
            <p className="text-white my-5 text-normal text-center font-weight-bold">
                Isso é tudo.
            </p>
        </section>
    );

    return (
        <section>
            <h1 className="font-weight-bold text-subtitle text-white text-center">
                Menu Digital
                {!isOnline && (
                    <div className="container-center">
                        <span
                            className="text-em-1-0 d-block text-pill"
                            style={{ backgroundColor: "var(--themePDark)" }}
                        >
                            Local
                        </span>
                    </div>
                )}
                <p className="my-2 mx-3 text-normal text-em-1-0">
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
                    <Fragment key={card.itemId}>
                        <ProductCard card={card} itemData={itemData} />
                    </Fragment>
                ))}
        </Fragment>
    );
}
// END COMP
