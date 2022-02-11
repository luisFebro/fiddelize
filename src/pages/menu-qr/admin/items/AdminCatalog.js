import { Fragment, useEffect, useState } from "react";
import CarouselCard from "components/carousels/CarouselCard";
import getAPI, { updateAdminItem } from "api";
import useData from "init";
import { Provider } from "context";
import getId from "utils/getId";
import { checkDetectedElem } from "api/useElemDetection";
// import removeObjDuplicate from "utils/arrays/removeObjDuplicate";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import RadiusBtn from "components/buttons/RadiusBtn";
import ReturnBtn from "components/buttons/ReturnBtn";
import useBackColor from "hooks/useBackColor";
import showToast from "components/toasts";
import useMainList from "./useMainList";
import { removeImg } from "./item-handler/img/UploadItemArea";
import useGlobalData from "./useGlobalData";
import ItemManager from "./ItemManager";
import ItemCardAdmin from "./ItemCardAdmin";
// import { setItems } from "init/lStorage";
// import convertToReal from "utils/numbers/convertToReal";

const AsyncShowItemContent = Load({
    loader: () =>
        import(
            "pages/menu-qr/admin/items/item-handler/AddItemContent" /* webpackChunkName: "add-item-content-lazy" */
        ),
});

const AsyncCategoryList = Load({
    loader: () =>
        import(
            "./item-list/CategoryList" /* webpackChunkName: "category-list-content-lazy" */
        ),
});

// LESSON: With carousels, it should be reload the page since there is an error to removeChild
export default function AdminCatalog() {
    const [flickity, setFlickity] = useState(null);
    const [randomId, setRandomId] = useState(null);
    const [showSingleItem, setShowSingleItem] = useState(false);
    const [priorList, setPriorList] = useState([]);

    const updateCarousel = () => setRandomId(getId());

    useBackColor("var(--mainWhite)");

    const [menuData, setMenuData] = useState({
        allCategories: ["_general"],
        itemList: [],
    });
    const { sexLetter } = useData();
    // const { allCategories, itemList = [] } = menuData;

    const updateItem = (type, options = {}) => {
        // updateCarousel();

        const {
            newItem,
            removalImg,
            catItemIdListUpdate,
            needReload = true,
            // newCategory,
            // oldCategory,
            // carouselInd,
            // isEdit,
        } = options;

        if (needReload) showToast("Fazendo atualizações...");

        // const handleCarousel = (ind) => {
        //     if (!flickity) return null;
        //     return ind === -1 || !flickity[ind]
        //         ? flickity[flickity.length - 1]
        //         : flickity[ind];
        // };
        // const selectedFlickity = carouselInd && handleCarousel(carouselInd);

        // if (type === "add") {
        //     if (newItem) {
        //         const duplicateFound =
        //             itemList.length &&
        //             itemList.find((item) => item.adName === newItem.adName);

        //         if (!isEdit && duplicateFound)
        //             return {
        //                 status: false,
        //                 txt: "Já tem um item com este nome",
        //             };
        //     }

        //     const handleField = (name, priorFields, newData) =>
        //         newData ? [newData, ...priorFields] : priorFields;

        //     setMenuData((prev) => {
        //         // if already has a category, return the the current list
        //         if (newCategory && allCategories.includes(newCategory))
        //             return prev;

        //         let thisNewCategory = handleField(
        //             "allCategories",
        //             prev.allCategories,
        //             newCategory
        //         );
        //         thisNewCategory = [...new Set(thisNewCategory)];

        //         const thisNewItem = handleField(
        //             "itemList",
        //             prev.itemList,
        //             newItem
        //         );

        //         // only need to be added locally here and update handle both local and db
        //         if (newCategory) return prev;

        //         if (selectedFlickity) selectedFlickity.destroy();

        //         return {
        //             ...prev,
        //             allCategories: thisNewCategory,
        //             itemList: thisNewItem,
        //         };
        //     });

        //     if (newCategory) return null;
        // }

        // if (type === "update") {
        //     if (catItemIdListUpdate) {
        //         setMenuData((prev) => {
        //             const newCatList = prev.itemList.map((item) => {
        //                 const needChangeCategory = catItemIdListUpdate.includes(
        //                     item.itemId
        //                 );
        //                 if (needChangeCategory)
        //                     return { ...item, category: newCategory };
        //                 return item;
        //             });

        //             // for multiple category update, it is required to destroy all to change carousels position
        //             if (selectedFlickity)
        //                 flickity.forEach((fl) => fl.destroy());

        //             return {
        //                 ...prev,
        //                 itemList: newCatList,
        //                 allCategories: [
        //                     ...new Set([newCategory, ...prev.allCategories]),
        //                 ],
        //             };
        //         });

        //         return updateInDb({ newItem, type, catItemIdListUpdate });
        //     }

        //     const whichUpdate =
        //         newItem && Boolean(newItem.categoryUpdate)
        //             ? "category"
        //             : "item";
        //     const isItem = whichUpdate === "item";

        //     const renewItem = () => {
        //         return itemList.map((item) => {
        //             // update unmarked items
        //             const generalListIds =
        //                 newItem && newItem.updateGeneralItemIds;
        //             if (generalListIds && generalListIds.length) {
        //                 if (generalListIds.includes(item.itemId))
        //                     return { ...item, category: "_general" };
        //             }

        //             if (item.itemId === newItem.itemId) return newItem;
        //             return item;
        //         });
        //     };

        //     const renewCategory = () =>
        //         allCategories.map((cat) => {
        //             if (cat === oldCategory) return newCategory;
        //             return cat;
        //         });

        //     let renewalData = false;
        //     if (isItem) renewalData = renewItem();
        //     else renewalData = renewCategory();

        //     setMenuData((prev) => {
        //         let thisNewCategory = !isItem
        //             ? renewalData
        //             : prev.allCategories;
        //         const thisNewItem = isItem ? renewalData : prev.itemList;
        //         thisNewCategory = [...new Set(thisNewCategory)];

        //         if (selectedFlickity) selectedFlickity.destroy();

        //         return {
        //             ...prev,
        //             allCategories: thisNewCategory,
        //             itemList: thisNewItem,
        //         };
        //     });
        // }

        // if (type === "delete") {
        // setMenuData((prev) => {
        //     const leftItems = prev.itemList.filter(
        //         (item) => !newItem.removalItemIds.includes(item.itemId)
        //     );
        //     if (selectedFlickity) selectedFlickity.destroy();
        // example data
        //     // removalImg: {
        //     //     savedImg: img, // string or an array of string with img urls
        //     //     folder: `digital-menu/${bizLinkName}`,
        //     // }
        //     if (removalImg) removeImg(removalImg);
        //     return {
        //         ...prev,
        //         itemList: leftItems,
        //         // allCategories: currCats || prev.allCategories,
        //     };
        // });
        // }

        const handleImg = async () => {
            if (!removalImg) return null;
            return await removeImg(removalImg);
        };

        return Promise.all([
            updateInDb({ newItem, type, catItemIdListUpdate }),
            handleImg(),
        ]).then(() => {
            if (needReload) window.location.reload();
        });
    };

    const showTitle = () => (
        <div className="mt-5 mb-3 text-center text-purple mx-3">
            <h1 className="text-subtitle text-purple font-weight-bold">
                Menu Digital (Admin)
            </h1>
        </div>
    );

    // LIST
    const {
        // skip,
        detectedCard,
        showSearchField,
        dataList,
        search,
        updateAdminCatalog,
    } = useMainList();

    const store = useGlobalData({
        updateItem,
        menuData,
        setMenuData,
        updateAdminCatalog,
    });

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
        needEmptyIllustra,
        ShowOverMsg,
        listTotal,
        // isOffline,
        // hasMore,
        // isPlural,
    } = dataList;
    // END LIST

    const dbCategories = moreData ? JSON.parse(moreData) : [];

    useEffect(() => {
        // update list when user scroll by detecting the size of it.
        if (dbCategories) {
            // const handleCarousel = () => {
            //     if (!flickity) return null;
            //     return skip === -1 || !flickity[skip]
            //         ? flickity[flickity.length - 1]
            //         : flickity[skip];
            // };

            // const selectedFlickity = handleCarousel();
            if (flickity) {
                flickity.forEach((f) => f.destroy());
                updateCarousel();
            }

            // setMenuData((prev) => ({
            //     ...prev,
            //     itemList: list,
            //     allCategories: dbCategories,
            // }));
        }

        if (list.length && !priorList.length) {
            setPriorList(list);
        }
        // insert dbCategories ccauses max depth error
    }, [list.length]);

    const showIllustration = () => (
        <main>
            <img
                className="img-center"
                src={`/img/illustrations/${
                    sexLetter === "o" ? "empty-cart" : "empty-woman-card"
                }.svg`}
                width={300}
                alt="sem itens"
            />
            <h2 className="text-subtitle text-grey text-center my-5 font-weight-bold">
                Sem Itens
            </h2>
        </main>
    );

    const gotData = list && Boolean(list.length);

    const handleTotal = () =>
        listTotal > 1 ? `${listTotal} itens` : `${listTotal} item`;

    // the list should has the same or higher length, otherwise it will throw an error with removeChild // e.g fickity for react: https://github.com/yaodingyd/react-flickity-component#readme
    const dataItems = list.length < priorList.length ? priorList : list;

    return (
        <Provider store={store}>
            {showTitle()}
            <ReturnBtn />
            <ItemManager />
            {showSearchField()}
            {!needEmptyIllustra && <div className="mt-5" />}
            <p className="mx-3 text-purple text-normal">
                <span className="font-weight-bold mr-2">total:</span>
                {loading ? "..." : handleTotal()}
            </p>
            <MenuList
                allCategories={dbCategories}
                itemList={dataItems}
                setFlickity={setFlickity}
                detectedCard={detectedCard}
                randomId={randomId}
                flickity={flickity}
            />
            {loading && <ShowLoadingSkeleton />}
            {!loading && !gotData && showIllustration()}
            {error && <ShowError />}
            {gotData && <ShowOverMsg txtColor="text-purple" />}
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
        </Provider>
    );
}

function MenuList({
    randomId,
    allCategories,
    detectedCard,
    itemList,
    setFlickity,
    flickity,
}) {
    const [showCategoryList, setShowCategoryList] = useState(false);

    return (
        <section>
            {Boolean(allCategories.length) &&
                allCategories.map((cat, ind) => {
                    const carouselInd = ind;

                    const filteredCategory =
                        itemList.filter((item) => item.category === cat) || [];
                    if (!filteredCategory.length) return <div />;

                    const ultimateList = filteredCategory;

                    const ThisCarouselList = (
                        <CarouselList
                            dataList={ultimateList}
                            detectedCard={detectedCard}
                            carouselInd={carouselInd}
                            flickity={flickity}
                        />
                    );

                    return (
                        <section className="" key={cat}>
                            <div className="d-flex justify-content-between">
                                <h2 className="d-table text-pill ml-3 text-normal text-purple font-weight-bold">
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
                                    CardList={ThisCarouselList}
                                    size="medium"
                                    multi
                                    // lazyLoad
                                    trigger={randomId}
                                    pageDots
                                    fullscreen
                                    setOuterFlickity={setFlickity}
                                    carouselInd={carouselInd}
                                />
                            </div>
                            {showCategoryList === ind && (
                                <ModalFullContent
                                    contentComp={
                                        <AsyncCategoryList
                                            category={cat}
                                            setFullOpen={setShowCategoryList}
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
}

// COMP
const CarouselList = ({
    dataList = [],
    detectedCard,
    carouselInd,
    flickity,
}) => (
    <Fragment>
        {Boolean(dataList.length) &&
            dataList
                .map((card, ind) =>
                    checkDetectedElem({
                        list: dataList,
                        ind,
                        indFromLast: 3,
                    }) ? (
                        <Fragment key={card._id}>
                            <ItemCardAdmin
                                ref={detectedCard}
                                card={card}
                                flickity={flickity}
                                carouselInd={carouselInd}
                            />
                        </Fragment>
                    ) : (
                        <Fragment key={card._id}>
                            <ItemCardAdmin
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
// END COMP

// HELPERS
async function updateInDb({ newItem, type, catItemIdListUpdate }) {
    getAPI({
        method: "post",
        url: updateAdminItem(),
        body: { ...newItem, _id: undefined }, // throw error if _id is another ID other than body
    }).then(() => {
        const handleMsg = () => {
            if (catItemIdListUpdate) return "categoria criada";
            if (type === "delete") return "excluído com sucesso";
            if (type === "update") return "Item atualizado";
            return "Item salvo";
        };
        console.log(handleMsg());
    });

    return { status: true };
}

// END HELPERS
