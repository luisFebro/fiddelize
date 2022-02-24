import { Fragment, useState, useEffect } from "react";
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
import { getCustomerGameData } from "pages/menu-qr/customer-catalog/customer-area/customer-panel/CustomerPanelContent";
import useMainList from "../admin/items/useMainList";
import useGlobalData from "./useGlobalData";
import { ContinueBtn, TotalInvest } from "./OrdersCart";
import ItemCardCustomer from "./ItemCardCustomer";
import CustomerArea from "./customer-area/CustomerArea";
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

const [
    digitalMenuData,
    // digitalMenuCurrPage,
    digitalMenuLogin,
    digitalMenuSkipLogin,
] = getItems("global", [
    "digitalMenuData",
    // "digitalMenuCurrPage",
    "digitalMenuLogin",
    "digitalMenuSkipLogin",
]);

export default function CustomerCatalog({
    adminId,
    placeId,
    customerId,
    bizLinkName,
    socket,
    isUsedLink,
    isOnline,
    bizLogo = "/img/error.png",
    sColor = "default",
    pColor = "default",
    backColor = "default",
    bizName,
    loadingMainData,
    currGame,
    adminGame,
    // url,
}) {
    const login = digitalMenuLogin && digitalMenuLogin[bizLinkName];

    const [nextPage, setNextPage] = useState("menu");
    const [data, setData] = useState({
        orderCount: 0,
        orderAmount: 0,
        orderList: [],
        // discount back
        allPoints: 0,
        customerPoints: 0,
        didBeatGame: false,
    });
    const {
        customerPoints,
        orderList,
        orderAmount,
        orderCount,
        didBeatGame,
    } = data;
    const [emailData, setEmailData] = useState({
        // login
        loginOk: Boolean(login) || false,
        email: login,
        errorEmail: false,
    });
    const { errorEmail, loginOk } = emailData;
    let { email } = emailData;
    email = email && email.trim();
    console.log("loginOk", loginOk);
    console.log("email", email);
    // loginOk and email gets undefined when initializes
    const isConnected =
        Boolean(loginOk || login) &&
        digitalMenuSkipLogin &&
        !digitalMenuSkipLogin[bizLinkName]; // loginOk && Boolean(email);
    // biz logo should be fetched with adminId when page is laoded
    useEffect(() => {
        if (login) {
            setEmailData((prev) => ({
                ...prev,
                email: login,
            }));
        }
    }, [login]);

    useEffect(() => {
        if (currGame && socket) {
            getCustomerGameData({
                socket,
                adminId,
                email,
                currGame,
                callback: (dt) =>
                    setData((prev) => ({
                        ...prev,
                        customerPoints: dt && dt.currPoints,
                    })),
            });
        }
    }, [currGame]);

    const { newImg: thisbizLogo, width, height } = removeImgFormat(bizLogo);

    const ids = {
        adminId,
        placeId,
        customerId,
    };

    const loginData = {
        isConnected,
        email,
        errorEmail,
        digitalMenuSkipLogin,
    };

    const gotSavedMenuData =
        digitalMenuData &&
        digitalMenuData[bizLinkName] &&
        digitalMenuData[bizLinkName].orderCount;
    useEffect(() => {
        // This digitalMenuCurrData should not be done because products could be outdated...
        // if (gotSavedMenuData) setData(digitalMenuData[bizLinkName]);

        // if it is a used link, then remain in the menu page and ignore local db
        // if (digitalMenuCurrPage === "orders") return setNextPage("orders");
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
    useBackColor(`var(--themeBackground--${backColor || "default"})`);

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
            digitalMenuData: {
                [bizLinkName]: data,
            },
            digitalMenuCurrPage: "menu",
        });
        if (!adminId)
            return showToast(
                "Uma informação não foi carregada. Reinicie a página e verifique sua conexão."
            );

        if (!orderAmount)
            return showToast("Menu Vazio! Por favor, selecione algum item.");

        setItems("global", {
            digitalMenuData: {
                [bizLinkName]: data,
            },
            digitalMenuCurrPage: "orders",
        });
        return setNextPage("orders");
    };

    const showLogo = () => (
        <Fragment>
            <div className="mt-2 container-center">
                <img
                    src={thisbizLogo}
                    width={width}
                    height={height}
                    title={`logo da ${bizLinkName}`}
                    alt={`logo empresa ${bizLinkName}`}
                />
            </div>
            <div className="mb-2 container-center">
                <p
                    style={{ top: -10, zIndex: -1 }}
                    className="m-0 position-relative biz-name-cli-digital-area text-subtitle text-white text-shadow text-center"
                >
                    {bizName}
                    <style jsx>
                        {`
                            .biz-name-cli-digital-area {
                                padding: 5px;
                                background: var(--themePDark--${pColor});
                            }
                        `}
                    </style>
                </p>
            </div>
        </Fragment>
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
                    isConnected={isConnected}
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
                    didBeatGame={didBeatGame}
                />
            )}
            {nextPage === "success" && (
                <AsyncOrderSuccess
                    allDataItem={data}
                    socket={socket}
                    ids={ids}
                    bizLinkName={bizLinkName}
                    didBeatGame={didBeatGame}
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
        loginData,
        setEmailData,
        emailData,
        adminId,
        sColor,
        pColor,
        backColor,
        bizName,
        bizLogo,
        bizLinkName,
        socket,
        loadingMainData,
        currGame,
        adminGame,
        customerPoints,
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
    isConnected,
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
                            {(isConnected || digitalMenuSkipLogin) && (
                                <section className="animated-fadeInUp">
                                    <TotalInvest
                                        orderAmount={orderAmount}
                                        orderCount={orderCount}
                                        setDefault={setDefault}
                                    />
                                    <ContinueBtn onClick={handleNextPage} />
                                </section>
                            )}
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
        if (search) setShowSingleItem(getId());
    }, [search]);

    return (
        <section>
            <CustomerArea isOnline={isOnline} />
            {showSearchField()}
            <br />
            {showList()}
            {loading && <ShowLoadingSkeleton />}
            {!loading && !gotData && showIllustration()}
            {error && <ShowError />}
            {gotData && <ShowOverMsg txtColor="text-white" brand />}
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
