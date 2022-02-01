import { useState, Fragment } from "react";
import DeleteButton from "components/buttons/DeleteButton";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { useBizData } from "init";
import useContext from "context";
import showToast from "components/toasts";
import removeObjDuplicate from "utils/arrays/removeObjDuplicate";
import ItemCard from "./ItemCard";

export default function ItemListContent({
    category,
    isAddCategory = false,
    setFullOpen = () => null,
    closeCategoryForm = () => null,
}) {
    const [dataList, setDataList] = useState({
        selectionList: [],
    });
    const { selectionList } = dataList;
    const { bizId, bizLinkName } = useBizData();
    const { updateItem, menuData = {} } = useContext();

    let { itemList, allCategories } = menuData;
    const carouselInd =
        category === null
            ? 0
            : allCategories && allCategories.indexOf(category);

    itemList = isAddCategory
        ? itemList
        : itemList.filter((item) => item.category === category);

    itemList = removeObjDuplicate(itemList);

    const totalSelected = selectionList.length;
    const tapHoldOn = Boolean(totalSelected);

    const catTitle = category === "_general" ? "gerais" : category;

    const showTitle = () => {
        const thisCat = catTitle && catTitle.cap();
        if (isAddCategory) {
            return (
                <h2 className="text-normal text-purple">
                    Selecione itens para categoria:{" "}
                    <span className="text-subtitle font-weight-bold">
                        {thisCat}
                    </span>
                </h2>
            );
        }
        return (
            <h2 className="text-subtitle text-purple font-weight-bold">
                {thisCat}
            </h2>
        );
    };

    const ultimateList = itemList; // or db list goes here

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
                {isAddCategory ? (
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

                                        itemList.forEach((item) => {
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
                                        // removalCategory: category,
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

    return (
        <section className="mx-3 text-center my-5 text-white text-hero">
            {showTitle()}
            {ultimateList.map((item) => (
                <Fragment key={item.itemId}>
                    <ItemCard
                        isAddCategory={isAddCategory}
                        data={item}
                        setDataList={setDataList}
                    />
                </Fragment>
            ))}
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
