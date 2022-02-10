import { useState, useEffect, Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import DeleteButton from "components/buttons/DeleteButton";
import useData, { useBizData } from "init";
// import removeObjDuplicate from "utils/arrays/removeObjDuplicate";
import useAPIList, { readMainItemList } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import useRun, { setRun, useAction } from "global-data/ui";
import showToast from "components/toasts";

// import useContext from "context";
import getId from "utils/getId";
import ItemCard from "./ItemCard";
// import ButtonFab from "components/buttons/material-ui/ButtonFab";

export default function FinalList({
    category,
    updateItem,
    isAddCat,
    setFullOpen,
    closeCategoryForm,
    isCustomerCatalog,
}) {
    const [trigger, setTrigger] = useState(false);
    const [dataList, setDataList] = useState({
        selectionList: [],
        generalList: [], // list to track unmarked items if priorly selected so that we can set to _general category
    });
    const { selectionList, generalList } = dataList;
    // const { updateAdminCatalog } = useContext();
    const limit = 10;

    const [skip, setSkip] = useState(0);
    const { bizId, bizLinkName } = useBizData();
    const { userId } = useData();

    const params = {
        userId, // for auth
        adminId: bizId,
        category: isAddCat ? undefined : category,
        isEditCategory: true,
    };

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const uify = useAction();
    useEffect(() => {
        if (runName && runName.includes("CategoryList")) {
            setSkip(0);
            setRun("runName", null, uify);
        }
        // eslint-disable-next-line
    }, [runName]);
    // END UPDATE

    // UPDATE LIST
    // const updateCategoryList = () =>
    //     setRun("runName", `CategoryList${getId()}`, uify);

    useEffect(() => {
        if (isAddCat) {
            setSkip(0);
            setTrigger(getId());
        }
    }, [isAddCat]);

    const {
        list = [],
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        moreData,
        isOffline,
        hasMore,
        ShowOverMsg,
        // listTotal,
        // isPlural,
    } = useAPIList({
        url: readMainItemList(),
        skip,
        limit,
        params,
        // disableDupFilter: true,
        trigger: trigger || runName || true,
        listName: "CategoryList", // for offline list only
    });

    const dbCategories = moreData && JSON.parse(moreData);
    const carouselInd =
        category === null ? 0 : dbCategories && dbCategories.indexOf(category);

    const totalSelected = selectionList.length;
    const tapHoldOn = Boolean(totalSelected);

    // useEffect(() => {
    //     setDataList((prev) => ({ ...prev, ultimateList: itemList }));
    // }, [itemList, type]);

    const showTapAndHoldOptions = () => (
        <section
            className="text-shadow text-white text-normal animated fadeInUp position-fixed"
            style={{
                bottom: 0,
                left: 0,
                right: 0,
                width: "100%",
                height: 60,
                background: "var(--themePDark)",
                zIndex: 1000,
            }}
        >
            <section className="mx-3 d-flex justify-content-between align-items-center">
                <p className="mt-3">
                    {totalSelected} {totalSelected === 1 ? "item" : "itens"}
                </p>
                {isAddCat ? (
                    <ButtonFab
                        title="salvar"
                        backgroundColor="var(--themeSDark)"
                        onClick={() => {
                            if (!selectionList.length)
                                return showToast(
                                    "Selecione pelo menos um item para adicionar à categoria.",
                                    { type: "error" }
                                );
                            const newItem = {
                                // this newItem is being used here exclusively for sending data to DB
                                adminId: bizId,
                                type: "updateMany",
                                updateItemIds: selectionList,
                                updateGeneralItemIds: generalList,
                                updateQuery: {
                                    category:
                                        category && category.toLowerCase(),
                                },
                            };

                            // updateItem("add", {
                            //     newCategory: category && category.toLowerCase(),
                            //     needReload: false,
                            // });
                            return updateItem("update", {
                                adminId: bizId,
                                newItem,
                                updateQuery: {
                                    category:
                                        category && category.toLowerCase(),
                                },
                                newCategory: category && category.toLowerCase(),
                                catItemIdListUpdate: selectionList,
                                carouselInd,
                            });

                            // updateAdminCatalog();
                            // setFullOpen(false);
                        }}
                        position="relative"
                        variant="extended"
                        size="small"
                    />
                ) : (
                    <div className="d-flex">
                        <div className="ml-2">
                            <DeleteButton
                                onClick={() => {
                                    const newItem = {
                                        // this newItem is being used here exclusively for sending data to DB
                                        adminId: bizId,
                                        type: "delete",
                                        removalItemIds: selectionList,
                                    };

                                    const getRemovalImgs = () => {
                                        const imgs = [];
                                        if (!list.length) return null;
                                        list.forEach((item) => {
                                            if (
                                                selectionList.includes(
                                                    item.itemId
                                                )
                                            ) {
                                                imgs.push(item.img);
                                            }
                                        });

                                        return imgs;
                                    };

                                    return updateItem("delete", {
                                        newItem,
                                        removalImg: {
                                            savedImg: getRemovalImgs(),
                                            folder: `digital-menu/${bizLinkName}`,
                                        },
                                    });

                                    // setFullOpen(false);
                                    // return closeCategoryForm();
                                }}
                            />
                        </div>
                    </div>
                )}
            </section>
        </section>
    );

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        isOffline,
        setSkip,
    });

    return (
        <section>
            {list.map((item, ind) =>
                checkDetectedElem({
                    list,
                    ind,
                    indFromLast: 2,
                }) ? (
                    <Fragment key={item.itemId}>
                        <ItemCard
                            ref={detectedCard}
                            isAddCategory={isAddCat}
                            data={item}
                            setDataList={setDataList}
                            selectedCategory={category}
                            isCustomerCatalog={isCustomerCatalog}
                        />
                    </Fragment>
                ) : (
                    <Fragment key={item.itemId}>
                        <ItemCard
                            isAddCategory={isAddCat}
                            data={item}
                            setDataList={setDataList}
                            selectedCategory={category}
                            isCustomerCatalog={isCustomerCatalog}
                        />
                    </Fragment>
                )
            )}
            {loading && <ShowLoadingSkeleton height="85%" />}
            {error && <ShowError />}
            {isCustomerCatalog && <ShowOverMsg />}
            {!isCustomerCatalog && tapHoldOn && showTapAndHoldOptions()}
            {!isCustomerCatalog && (
                <p className="my-3 main-font text-small font-weight-bold mx-3 text-grey">
                    clique e segure um ou mais itens para mais opções
                </p>
            )}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}
