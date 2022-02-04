import { useState, useEffect, Fragment } from "react";
import DeleteButton from "components/buttons/DeleteButton";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import RadiusBtn from "components/buttons/RadiusBtn";
import { useBizData } from "init";
import useContext from "context";
import showToast from "components/toasts";
import removeObjDuplicate from "utils/arrays/removeObjDuplicate";
import { checkDetectedElem } from "api/useElemDetection";
import useMainList from "../useMainList";
import ItemCard from "./ItemCard";
import EditCategoryTitle from "./EditCategoryTitle";

export default function ItemListContent({
    category,
    isAddCategory = false,
    setFullOpen = () => null,
    closeCategoryForm = () => null,
}) {
    const [dataList, setDataList] = useState({
        type: isAddCategory ? "addCat" : "showCat",
        selectionList: [],
        ultimateList: [], // db loaded list
        generalList: [], // list to track unmarked items if priorly selected so that we can set to _general category
    });
    const { selectionList, generalList, type } = dataList;
    let { ultimateList } = dataList;
    const isAddCat = type === "addCat";
    const isShowCat = type === "showCat";

    const { bizId, bizLinkName } = useBizData();
    const { updateItem, menuData = {} } = useContext();

    const { itemList } = menuData;

    useEffect(() => {
        setDataList((prev) => ({ ...prev, ultimateList: itemList }));
    }, [itemList, type]);

    const { allCategories } = menuData;
    const carouselInd =
        category === null
            ? 0
            : allCategories && allCategories.indexOf(category);

    const totalSelected = selectionList.length;
    const tapHoldOn = Boolean(totalSelected);

    const catTitle = category === "_general" ? "gerais" : category;

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

                            updateItem("add", {
                                newCategory: category && category.toLowerCase(),
                            });
                            updateItem("update", {
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
                            if (typeof setFullOpen === "function")
                                setFullOpen(false);
                            return closeCategoryForm();
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
                                        if (!ultimateList.length) return null;
                                        ultimateList.forEach((item) => {
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

                                    updateItem("delete", {
                                        newItem,
                                        removalImg: {
                                            savedImg: getRemovalImgs(),
                                            folder: `digital-menu/${bizLinkName}`,
                                        },
                                    });

                                    setFullOpen(false);
                                    return closeCategoryForm();
                                }}
                            />
                        </div>
                    </div>
                )}
            </section>
        </section>
    );

    // LIST
    const {
        detectedCard,
        dataList: payloadAPIList,
        // setDbLoaded,
        // dbLoaded,
    } = useMainList({ category: isAddCategory ? undefined : category });

    const {
        list,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        moreData,
        // ShowOverMsg,
        // listTotal,
        // isOffline,
        // hasMore,
        // isPlural,
    } = payloadAPIList;
    // END LIST

    const showEditCategory = () => (
        <div
            className="container-center"
            style={{
                zIndex: 10000,
            }}
        >
            <RadiusBtn
                title="editar categoria"
                backgroundColor="var(--themeSDark)"
                onClick={() =>
                    setDataList((prev) => ({ ...prev, type: "addCat" }))
                }
                position="relative"
                size="small"
            />
        </div>
    );

    const showTitle = () => {
        const thisCat = catTitle && catTitle.cap();
        if (isAddCat) {
            return (
                <EditCategoryTitle
                    updateItem={updateItem}
                    thisCat={thisCat && thisCat.toLowerCase()}
                    setFullOpen={setFullOpen}
                />
            );
        }

        return (
            <h2 className="text-subtitle text-purple font-weight-bold">
                {thisCat}
                {isShowCat && showEditCategory()}
            </h2>
        );
    };

    ultimateList = isAddCat
        ? ultimateList
        : ultimateList.filter((item) => item.category === category);

    ultimateList = removeObjDuplicate(ultimateList);

    const dbCategories = moreData && JSON.parse(moreData);

    useEffect(() => {
        // update list when user scroll by detecting the size of it.
        if (dbCategories) {
            setDataList((prev) => ({
                ...prev,
                ultimateList: list,
                allCategories: dbCategories,
            }));
        }
        // insert dbCategories ccauses max depth error
        // eslint-disable-next-line
    }, [list.length]);

    const gotData = ultimateList && Boolean(ultimateList.length);

    return (
        <section className="mx-3 text-center my-5 text-white text-hero">
            {showTitle()}
            {ultimateList.map((item, ind) =>
                checkDetectedElem({
                    list: dataList,
                    ind,
                    indFromLast: 3,
                }) ? (
                    <Fragment key={item.itemId}>
                        <ItemCard
                            ref={detectedCard}
                            isAddCategory={isAddCat}
                            data={item}
                            setDataList={setDataList}
                            alreadySelected={item.category === category}
                        />
                    </Fragment>
                ) : (
                    <Fragment key={item.itemId}>
                        <ItemCard
                            isAddCategory={isAddCat}
                            data={item}
                            setDataList={setDataList}
                            alreadySelected={item.category === category}
                        />
                    </Fragment>
                )
            )}
            {loading && <ShowLoadingSkeleton height="85%" />}
            {error && <ShowError />}
            {tapHoldOn && showTapAndHoldOptions()}
            <p className="my-3 main-font text-small font-weight-bold mx-3 text-grey">
                clique e segure um ou mais itens para mais opções
            </p>
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}

/*
// set future updates to hide items
<DeleteButton
    onClick={null}
/>

 */
