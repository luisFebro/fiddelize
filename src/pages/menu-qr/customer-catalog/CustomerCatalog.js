import { Fragment, useState, useEffect } from "react";
import { useBizData } from "init";
import CarouselCard from "components/carousels/CarouselCard";
import showToast from "components/toasts";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import getItems, { setItems, removeItems } from "init/lStorage";
import { checkDetectedElem } from "api/useElemDetection";
import useMainList from "pages/menu-qr/admin/items/useMainList";
import removeImgFormat from "utils/biz/removeImgFormat";
import { Load } from "components/code-splitting/LoadableComp";
import ModalFullContent from "components/modals/ModalFullContent";
import { ContinueBtn, TotalInvest } from "./OrdersCart";
import ItemCardCustomer from "./ItemCardCustomer";
import {
    updateItem,
    removeItem,
    useOrderTotal,
} from "./helpers/customerOrderMethods";

const AsyncShowItemContent = Load({
    loader: () =>
        import(
            "pages/menu-qr/admin/items/item-handler/AddItemContent" /* webpackChunkName: "add-item-content-lazy" */
        ),
});

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
                    adminId={adminId}
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
    adminId,
}) {
    const [showSingleItem, setShowSingleItem] = useState(false);

    // LIST
    const {
        detectedCard,
        showSearchField,
        dataList,
        search,
        updateAdminCatalog,
    } = useMainList({ adminId });

    useEffect(() => {
        if (search) setShowSingleItem(true);
    }, [search]);

    const {
        list = [],
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        moreData,
        ShowOverMsg,
        // needEmptyIllustra,
        // listTotal,
        // isOffline,
        // hasMore,
        // isPlural,
    } = dataList;
    // END LIST

    const allCategories = moreData ? JSON.parse(moreData) : [];
    const dataProducts = list;

    function MenuList() {
        return (
            <section>
                {Boolean(allCategories.length) &&
                    allCategories.map((cat) => {
                        const filteredCategory =
                            dataProducts.filter(
                                (item) => item.category === cat
                            ) || [];
                        if (!filteredCategory.length) return <div />;

                        const ThisCardList = (
                            <CarouselList
                                dataList={filteredCategory}
                                itemData={itemData}
                                detectedCard={detectedCard}
                            />
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
                                        lazyLoad
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
            </section>
        );
    }

    const showIllustration = () => (
        <main>
            <img
                className="img-center"
                src="/img/illustrations/empty-woman-card.svg"
                width={300}
                alt="sem itens"
            />
            <h2 className="text-subtitle text-grey text-center my-5 font-weight-bold">
                Sem Itens
            </h2>
        </main>
    );

    const gotData = list && Boolean(list.length);

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
                </p>
            </h1>
            {showSearchField()}
            <br />
            <MenuList />
            {loading && <ShowLoadingSkeleton />}
            {!loading && !gotData && showIllustration()}
            {error && <ShowError />}
            {gotData && <ShowOverMsg txtColor="text-white" />}
            <div style={{ marginBottom: 150 }} />
            {showSingleItem && (
                <ModalFullContent
                    contentComp={
                        <AsyncShowItemContent
                            itemSearch={search}
                            handleFullClose={setShowSingleItem}
                        />
                    }
                    fullOpen={showSingleItem}
                    setFullOpen={setShowSingleItem}
                    backgroundColor="var(--themePDark)"
                />
            )}
        </section>
    );
}

// COMP
function CarouselList({ dataList = [], itemData, detectedCard }) {
    return (
        <Fragment>
            {dataList.length &&
                dataList.map((card, ind) =>
                    checkDetectedElem({
                        list: dataList,
                        ind,
                        indFromLast: 3,
                    }) ? (
                        <Fragment key={card._id}>
                            <ItemCardCustomer
                                ref={detectedCard}
                                card={card}
                                itemData={itemData}
                            />
                        </Fragment>
                    ) : (
                        <Fragment key={card._id}>
                            <ItemCardCustomer card={card} itemData={itemData} />
                        </Fragment>
                    )
                )}
        </Fragment>
    );
}
// END COMP
