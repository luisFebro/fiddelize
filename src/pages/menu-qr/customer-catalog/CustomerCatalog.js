import { Fragment, useState, useEffect } from "react";
import { useBizData } from "init";
import { Provider } from "context";
import CarouselCard from "components/carousels/CarouselCard";
import showToast from "components/toasts";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import getItems, { setItems, removeItems } from "init/lStorage";
import { checkDetectedElem } from "api/useElemDetection";
import removeImgFormat from "utils/biz/removeImgFormat";
import { Load } from "components/code-splitting/LoadableComp";
import ModalFullContent from "components/modals/ModalFullContent";
import getId from "utils/getId";
import RadiusBtn from "components/buttons/RadiusBtn";
import useMainList from "../admin/items/useMainList";
import useGlobalData from "./useGlobalData";
import { ContinueBtn, TotalInvest } from "./OrdersCart";
import ItemCardCustomer from "./ItemCardCustomer";
import {
    updateItem,
    removeItem,
    useOrderTotal,
} from "./helpers/customerOrderMethods";

const AsyncShowSingleItem = Load({
    loader: () =>
        import(
            "./item-handler/ShowSingleItem" /* webpackChunkName: "show-single-item-lazy" */
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

const AsyncCategoryList = Load({
    loader: () =>
        import(
            "pages/menu-qr/admin/items/item-list/CategoryList" /* webpackChunkName: "category-list-content-lazy" */
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
    // biz logo should be fetched with adminId when page is laoded

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

    const itemData = {
        handleItem,
        orderList,
    };

    const store = useGlobalData({
        itemData,
    });

    return (
        <Provider store={store}>
            {showLogo()}
            {showPages()}
        </Provider>
    );
}

// COMP
function DigitalMenu({
    setDefault,
    handleNextPage,
    orderAmount,
    orderCount,
    isOnline,
    adminId,
}) {
    const [showCategoryList, setShowCategoryList] = useState(null);
    const [flickity, setFlickity] = useState(null);
    const [randomId, setRandomId] = useState(null);
    const [priorList, setPriorList] = useState([]);

    const updateCarousel = () => setRandomId(getId());

    // LIST
    const {
        detectedCard,
        showSearchField,
        dataList,
        search,
        updateAdminCatalog,
    } = useMainList({ adminId });

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

    const allCategories = moreData ? JSON.parse(moreData) : [];

    useEffect(() => {
        // update list when user scroll by detecting the size of it.
        if (allCategories) {
            if (flickity) {
                flickity.forEach((f) => f.destroy());
                updateCarousel();
            }
        }

        if (list.length && !priorList.length) {
            setPriorList(list);
        }
        // insert dbCategories causes max depth error
    }, [list.length]);
    // END LIST

    // the list should has the same or higher length, otherwise it will throw an error with removeChild // e.g fickity for react: https://github.com/yaodingyd/react-flickity-component#readme
    const dataItems = list.length < priorList.length ? priorList : list;

    const showList = () => (
        <section>
            {Boolean(allCategories.length) &&
                allCategories.map((cat, ind) => {
                    const carouselInd = ind;

                    const filteredCategory =
                        dataItems.filter((item) => item.category === cat) || [];
                    if (!filteredCategory.length) return <div />;

                    const ThisCardList = (
                        <CarouselList
                            dataList={filteredCategory}
                            detectedCard={detectedCard}
                            carouselInd={carouselInd}
                            flickity={flickity}
                        />
                    );

                    return (
                        <section key={cat}>
                            <div className="d-flex justify-content-between">
                                <h2
                                    className="d-table text-pill ml-3 text-normal text-purple font-weight-bold"
                                    style={{
                                        backgroundColor: "var(--themePDark)",
                                    }}
                                >
                                    {cat === "_general" ? "gerais" : cat}
                                </h2>
                                <div className="mr-3">
                                    <RadiusBtn
                                        title="ver todos"
                                        backgroundColor="var(--themeSDark)"
                                        onClick={() => setShowCategoryList(ind)}
                                        position="relative"
                                        size="extra-small"
                                    />
                                </div>
                            </div>
                            <div>
                                <CarouselCard
                                    CardList={ThisCardList}
                                    size="large"
                                    multi
                                    // lazyLoad
                                    trigger={randomId}
                                    pageDots
                                    fullscreen
                                    setOuterFlickity={setFlickity}
                                    carouselInd={carouselInd}
                                    pageDotsColor="#b59e9e"
                                />
                            </div>
                            <TotalInvest
                                orderAmount={orderAmount}
                                orderCount={orderCount}
                                setDefault={setDefault}
                            />
                            <ContinueBtn onClick={handleNextPage} />
                            {showCategoryList === ind && (
                                <ModalFullContent
                                    contentComp={
                                        <AsyncCategoryList
                                            category={cat}
                                            setFullOpen={setShowCategoryList}
                                            isCustomerCatalog
                                        />
                                    }
                                    fullOpen={showCategoryList === ind}
                                    setFullOpen={setShowCategoryList}
                                    backgroundColor="var(--mainWhite)"
                                />
                            )}
                        </section>
                    );
                })}
        </section>
    );

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

    const [showSingleItem, setShowSingleItem] = useState(false);
    useEffect(() => {
        if (search) setShowSingleItem(true);
    }, [search]);

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
            {showList()}
            {loading && <ShowLoadingSkeleton />}
            {!loading && !gotData && showIllustration()}
            {error && <ShowError />}
            {gotData && <ShowOverMsg txtColor="text-white" />}
            <div style={{ marginBottom: 150 }} />
            {showSingleItem && (
                <ModalFullContent
                    contentComp={
                        <AsyncShowSingleItem
                            adminId={adminId}
                            itemSearch={search}
                            handleFullClose={setShowSingleItem}
                            marginBottom={100}
                            updateAdminCatalog={updateAdminCatalog}
                        />
                    }
                    fullOpen={showSingleItem}
                    setFullOpen={setShowSingleItem}
                    backgroundColor="var(--themePDark)"
                    needIndex={6000}
                />
            )}
        </section>
    );
}

// function areEqual(prevProps, nextProps) {
//     return prevProps.dataList.length === nextProps.dataList.length && prevProps.carouselInd === nextProps.carouselInd;
// }

// COMP
const CarouselList = (props) => {
    const { dataList = [], detectedCard, flickity, carouselInd } = props;

    return (
        <Fragment>
            {dataList.length &&
                dataList
                    .map((card, ind) =>
                        checkDetectedElem({
                            list: dataList,
                            ind,
                            indFromLast: 3,
                        }) ? (
                            <Fragment key={card._id}>
                                <ItemCardCustomer
                                    ref={detectedCard}
                                    card={card}
                                    flickity={flickity}
                                    carouselInd={carouselInd}
                                />
                            </Fragment>
                        ) : (
                            <Fragment key={card._id}>
                                <ItemCardCustomer
                                    card={card}
                                    flickity={flickity}
                                    carouselInd={carouselInd}
                                />
                            </Fragment>
                        )
                    )
                    .slice(0, 5)}
        </Fragment>
    );
};

CarouselList.displayName = "CarouselList";
// END COMP
