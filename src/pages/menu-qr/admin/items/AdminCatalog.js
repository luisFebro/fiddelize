import { Fragment, useState } from "react";
import CarouselCard from "components/carousels/CarouselCard";
import getItems, { setItems } from "init/lStorage";
// import convertToReal from "utils/numbers/convertToReal";
import showToast from "components/toasts";
import getAPI, { updateAdminItem } from "api";
import useData from "init";
import { Provider } from "context";
import getId from "utils/getId";
import { removeImg } from "./item-handler/img/UploadItemArea";
import useGlobalData from "./useGlobalData";
import ItemManager from "./ItemManager";
import ItemCardAdmin from "./ItemCardAdmin";

const [digitalMenuCategories, digitalMenuItemList] = getItems("global", [
    "digitalMenuCategories",
    "digitalMenuItemList",
]);

export default function AdminCatalog() {
    const [f, setF] = useState(null);

    const [menuData, setMenuData] = useState({
        allCategories:
            digitalMenuCategories && digitalMenuCategories.length
                ? digitalMenuCategories
                : ["_general"],
        itemList:
            digitalMenuItemList && digitalMenuItemList.length
                ? digitalMenuItemList
                : [],
    });
    const { allCategories, itemList = [] } = menuData;
    const { sexLetter } = useData();

    const updateItem = (type, options = {}) => {
        const { newItem, newCategory, oldCategory, removalImg } = options;

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

            const maxItems = 10;
            const handleField = (name, priorFields, newData) =>
                newData
                    ? [newData, ...priorFields].slice(0, maxItems)
                    : priorFields;

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

                if (f) f.destroy();

                return {
                    ...prev,
                    allCategories: thisNewCategory,
                    itemList: thisNewItem,
                };
            });
        }

        if (type === "update") {
            const whichUpdate = newItem ? "item" : "category";
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

                if (f) f.destroy();

                return {
                    ...prev,
                    allCategories: thisNewCategory,
                    itemList: thisNewItem,
                };
            });
        }

        const isDelete = type === "delete";
        if (isDelete) {
            setMenuData(async (prev) => {
                const leftItems = prev.itemList.filter(
                    (item) => !newItem.removalItemIds.includes(item.itemId)
                );

                setItems("global", {
                    digitalMenuItemList: leftItems,
                });

                await removeImg(removalImg);

                if (f) f.destroy();

                return {
                    ...prev,
                    itemList: leftItems,
                    // allCategories: thisNewCategory,
                };
            });
        }

        getAPI({
            method: "post",
            url: updateAdminItem(),
            body: { ...newItem, _id: undefined }, // throw error if _id is another ID other than body
        }).then(() => {
            const handleMsg = () => {
                if (isDelete) return "Item removido!";
                if (type === "update") return "Item atualizado!";
                return "Item salvo!";
            };
            showToast(handleMsg(), { type: "success" });
        });

        return { status: true };
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
    });

    return (
        <Provider store={store}>
            {showTitle()}
            <ItemManager />
            {itemList.length ? (
                <Fragment>
                    <div className="mt-5" />
                    <MenuList
                        allCategories={allCategories}
                        itemList={itemList}
                        setF={setF}
                    />
                </Fragment>
            ) : (
                <main>
                    <img
                        className="img-center"
                        src={`/img/illustrations/${
                            sexLetter === "o"
                                ? "empty-cart"
                                : "empty-woman-card"
                        }.svg`}
                        width={300}
                        alt="sem itens"
                    />
                    <h2 className="text-subtitle text-grey text-center my-5 font-weight-bold">
                        Sem Itens
                    </h2>
                </main>
            )}
            <div style={{ marginBottom: 150 }} />
        </Provider>
    );
}

function MenuList({ allCategories, itemList, setF }) {
    const triggerCarousel = getId();

    return (
        <section className="">
            {allCategories.map((cat) => {
                const filteredCategory =
                    itemList.filter((item) => item.category === cat) || [];
                if (!filteredCategory.length) return <div />;

                const ThisCarouselList = (
                    <CarouselList dataList={filteredCategory} />
                );

                return (
                    <section className="" key={cat}>
                        <h2 className="d-table text-pill ml-3 text-normal text-purple font-weight-bold">
                            {cat === "_general" ? "gerais" : cat}
                        </h2>
                        <div>
                            <CarouselCard
                                CardList={ThisCarouselList}
                                size="medium"
                                multi
                                lazyLoad
                                trigger={triggerCarousel}
                                pageDots
                                fullscreen
                                setOuterFlickity={setF}
                            />
                        </div>
                    </section>
                );
            })}
        </section>
    );
}

// COMP
const CarouselList = ({ dataList = [] }) => (
    <Fragment>
        {dataList.length &&
            dataList.map((card) => (
                <Fragment key={card._id}>
                    <ItemCardAdmin card={card} />
                </Fragment>
            ))}
    </Fragment>
);
// END COMP
