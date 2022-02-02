import { Fragment, useEffect, useState } from "react";
import CarouselCard from "components/carousels/CarouselCard";
import { setItems } from "init/lStorage";
import getAPI, { updateAdminItem } from "api";
import useData from "init";
import { Provider } from "context";
import getId from "utils/getId";
import { checkDetectedElem } from "api/useElemDetection";
import removeObjDuplicate from "utils/arrays/removeObjDuplicate";
import useMainList from "./useMainList";
import { removeImg } from "./item-handler/img/UploadItemArea";
import useGlobalData from "./useGlobalData";
import ItemManager from "./ItemManager";
import ItemCardAdmin from "./ItemCardAdmin";
import ItemListBtn from "./item-list/ItemListBtn";
// import convertToReal from "utils/numbers/convertToReal";
// import showToast from "components/toasts";

export default function AdminCatalog() {
    const [flickity, setFlickity] = useState(null);
    const [randomId, setRandomId] = useState(null);

    const [menuData, setMenuData] = useState({
        allCategories: ["_general"],
        itemList: [],
    });
    const { allCategories, itemList = [] } = menuData;
    const { sexLetter } = useData();

    const updateItem = (type, options = {}) => {
        setRandomId(getId());

        const {
            newItem,
            catItemIdListUpdate,
            updateCategory,
            newCategory,
            oldCategory,
            removalImg,
            carouselInd = 0,
        } = options;

        const handleCarousel = () => {
            if (!flickity) return null;
            return carouselInd === -1 || !flickity[carouselInd]
                ? flickity[flickity.length - 1]
                : flickity[carouselInd];
        };
        const selectedFlickity = handleCarousel();

        if (type === "add") {
            if (newItem) {
                const duplicateFound =
                    itemList.length &&
                    itemList.find((item) => item.adName === newItem.adName);

                if (duplicateFound)
                    return {
                        status: false,
                        txt: "Já tem um item com este nome",
                    };
            }

            const handleField = (name, priorFields, newData) =>
                newData ? [newData, ...priorFields] : priorFields;

            setMenuData((prev) => {
                const thisNewCategory = handleField(
                    "allCategories",
                    prev.allCategories,
                    newCategory
                );
                const thisNewItem = handleField(
                    "itemList",
                    prev.itemList,
                    newItem
                );

                setItems("global", {
                    digitalMenuCategories: thisNewCategory,
                    digitalMenuItemList: thisNewItem,
                });

                // only need to be added locally here and update handle both local and db
                if (newCategory) return prev;

                if (selectedFlickity) selectedFlickity.destroy();

                return {
                    ...prev,
                    allCategories: thisNewCategory,
                    itemList: thisNewItem,
                };
            });

            if (newCategory) return null;
        }

        if (type === "update") {
            if (catItemIdListUpdate) {
                setMenuData((prev) => {
                    const newCatList = prev.itemList.map((item) => {
                        const needChangeCategory = catItemIdListUpdate.includes(
                            item.itemId
                        );
                        if (needChangeCategory)
                            return { ...item, category: newCategory };
                        return item;
                    });

                    setItems("global", {
                        digitalMenuItemList: newCatList,
                    });

                    if (selectedFlickity) selectedFlickity.destroy();

                    return {
                        ...prev,
                        itemList: newCatList,
                        allCategories: [newCategory, ...prev.allCategories],
                    };
                });

                return updateInDb({ newItem, type, catItemIdListUpdate });
            }

            const whichUpdate =
                newItem && Boolean(newItem.categoryUpdate)
                    ? "category"
                    : "item";
            const isItem = whichUpdate === "item";

            const renewItem = () =>
                itemList.map((item) => {
                    if (item.itemId === newItem.itemId) return newItem;
                    return item;
                });

            const renewCategory = () =>
                allCategories.map((cat) => {
                    if (cat === oldCategory) return newCategory;
                    return cat;
                });

            let renewalData = false;
            if (isItem) renewalData = renewItem();
            else renewalData = renewCategory();

            setMenuData((prev) => {
                const thisNewCategory = !isItem
                    ? renewalData
                    : prev.allCategories;
                const thisNewItem = isItem ? renewalData : prev.itemList;

                setItems("global", {
                    digitalMenuCategories: thisNewCategory,
                    digitalMenuItemList: thisNewItem,
                });

                if (selectedFlickity) selectedFlickity.destroy();

                return {
                    ...prev,
                    allCategories: thisNewCategory,
                    itemList: thisNewItem,
                };
            });
        }

        if (type === "delete") {
            setMenuData((prev) => {
                const leftItems = prev.itemList.filter(
                    (item) => !newItem.removalItemIds.includes(item.itemId)
                );

                setItems("global", {
                    digitalMenuItemList: leftItems,
                });

                if (selectedFlickity) selectedFlickity.destroy();

                /*
                removalImg: {
                    savedImg: img, // string or an array of string with img urls
                    folder: `digital-menu/${bizLinkName}`,
                }
                 */
                if (removalImg) removeImg(removalImg);

                // let currCats = null;
                // if(removalCategory) {
                //     const categoryStillOn = prev.allCategories.filter(c => c === removalCategory);
                //     console.log("categoryStillOn", categoryStillOn);
                //     if(!categoryStillOn && categoryStillOn.length === 1) {
                //         currCats = prev.allCategories;
                //         console.log("currCats", currCats);
                //         const indRemovalCat = currCats.indexOf(removalCategory);
                //         currCats.shift(indRemovalCat, 1);
                //         console.log("currCats", currCats);

                //         setItems("global", {
                //             digitalMenuCategories: currCats,
                //         })
                //     }
                // }

                return {
                    ...prev,
                    itemList: leftItems,
                    // allCategories: currCats || prev.allCategories,
                };
            });
        }

        return updateInDb({ newItem, type });
    };

    const showTitle = () => (
        <div className="mt-5 mb-3 text-center text-purple mx-3">
            <h1 className="text-subtitle text-purple font-weight-bold">
                Menu Digital (Admin)
            </h1>
        </div>
    );

    const store = useGlobalData({
        updateItem,
        menuData,
        setMenuData,
    });

    // LIST
    const {
        skip,
        detectedCard,
        showSearchField,
        dataList,
        setDbLoaded,
        dbLoaded,
    } = useMainList();

    const {
        list = [],
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        moreData,
        needEmptyIllustra,
        ShowOverMsg,
        // listTotal,
        // isOffline,
        // hasMore,
        // isPlural,
    } = dataList;
    // END LIST

    const dbCategories = moreData && JSON.parse(moreData);

    useEffect(() => {
        const needUpdateLStorage = !dbLoaded && dbCategories;
        if (needUpdateLStorage) {
            setItems("global", {
                digitalMenuCategories: dbCategories,
                digitalMenuItemList: list,
            });
            setDbLoaded(true);
        }
        // eslint-disable-next-line
    }, [dbCategories, dbLoaded]);

    useEffect(() => {
        // update list when user scroll by detecting the size of it.
        if (dbCategories) {
            const handleCarousel = () => {
                if (!flickity) return null;
                return skip === -1 || !flickity[skip]
                    ? flickity[flickity.length - 1]
                    : flickity[skip];
            };

            const selectedFlickity = handleCarousel();
            if (selectedFlickity) {
                selectedFlickity.destroy();
                setRandomId(getId());
            }

            setMenuData((prev) => ({
                ...prev,
                itemList: list,
                allCategories: dbCategories,
            }));
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

    const gotData = itemList && Boolean(itemList.length);

    return (
        <Provider store={store}>
            <div id="mainAdminCatalog" />
            {showTitle()}
            <ItemManager />
            {!needEmptyIllustra && <div className="mt-5" />}
            <MenuList
                allCategories={allCategories}
                itemList={itemList}
                setFlickity={setFlickity}
                detectedCard={detectedCard}
                randomId={randomId}
                flickity={flickity}
            />
            {loading && <ShowLoadingSkeleton />}
            {!gotData && showIllustration()}
            {error && <ShowError />}
            {gotData && <ShowOverMsg />}
            <div style={{ marginBottom: 100 }} />
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
    return (
        <section>
            {Boolean(allCategories.length) &&
                allCategories.map((cat, ind) => {
                    const carouselInd = ind;

                    const filteredCategory =
                        itemList.filter((item) => item.category === cat) || [];
                    if (!filteredCategory.length) return <div />;

                    const ultimateList = removeObjDuplicate(filteredCategory, {
                        filterId: "_id",
                    });

                    const ThisCarouselList = (
                        <CarouselList
                            dataList={ultimateList}
                            detectedCard={detectedCard}
                            carouselInd={carouselInd}
                            flickity={flickity}
                            category={cat}
                        />
                    );

                    return (
                        <section className="" key={cat}>
                            <div className="d-flex justify-content-between">
                                <h2 className="d-table text-pill ml-3 text-normal text-purple font-weight-bold">
                                    {cat === "_general" ? "gerais" : cat}
                                </h2>
                                <div className="mr-3">
                                    <ItemListBtn
                                        category={cat}
                                        carouselInd={carouselInd}
                                    />
                                </div>
                            </div>
                            <div>
                                <CarouselCard
                                    CardList={ThisCarouselList}
                                    size="medium"
                                    multi
                                    lazyLoad
                                    trigger={randomId}
                                    pageDots
                                    fullscreen
                                    setOuterFlickity={setFlickity}
                                    carouselInd={carouselInd}
                                />
                            </div>
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
    category,
}) => (
    <Fragment>
        {dataList.length &&
            dataList
                .map((card, ind) =>
                    checkDetectedElem({
                        list: dataList,
                        ind,
                        indFromLast: 2,
                    }) ? (
                        <Fragment key={card._id}>
                            <ItemCardAdmin
                                ref={detectedCard}
                                card={card}
                                flickity={flickity}
                                category={category}
                            />
                        </Fragment>
                    ) : (
                        <Fragment key={card._id}>
                            <ItemCardAdmin
                                card={card}
                                flickity={flickity}
                                category={category}
                            />
                        </Fragment>
                    )
                )
                .slice(0, 5)}
    </Fragment>
);
// END COMP

// HELPERS
function updateInDb({ newItem, type, catItemIdListUpdate }) {
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
