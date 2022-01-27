import { Fragment, useState } from "react";
import CarouselCard from "components/carousels/CarouselCard";
import getItems, { setItems } from "init/lStorage";
import convertToReal from "utils/numbers/convertToReal";
import showToast from "components/toasts";
import getAPI, { updateAdminItem } from "api";
import useData from "init";
import ItemManager from "./ItemManager";
import ItemCardAdmin from "./ItemCardAdmin";

const [digitalMenuCategories, digitalMenuItemList] = getItems("global", [
    "digitalMenuCategories",
    "digitalMenuItemList",
]);

export default function AdminCatalog() {
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
    const { allCategories, itemList } = menuData;
    const { sexLetter } = useData();

    const updateItem = (type, options = {}) => {
        const { newItem, newCategory } = options;

        if (type === "add") {
            if (newItem) {
                const duplicateFound = itemList.find(
                    (item) => item.adName === newItem.adName
                );
                if (duplicateFound)
                    return {
                        status: false,
                        txt: "Já tem um item com este nome",
                    };
            }

            const handleField = (name, field, newData) =>
                newData ? [newData, ...field] : field;
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

                window.location.reload();
                // there is an issue after insert an eleme to flickty
                // return({
                //     ...prev,
                //     allCategories: thisNewCategory,
                //     itemList: thisNewItem,
                // })
            });
        }

        getAPI({
            method: "post",
            url: updateAdminItem(),
            body: { ...newItem, _id: undefined }, // throw error if _id is another ID other than body
        }).then(() => {
            showToast("Item salvo!", { type: "success" });
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

    return (
        <Fragment>
            {showTitle()}
            <ItemManager updateItem={updateItem} />
            {itemList.length ? (
                <Fragment>
                    <div className="mt-5" />
                    <MenuList
                        allCategories={allCategories}
                        itemList={itemList}
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
        </Fragment>
    );
}

function MenuList({ allCategories, itemList }) {
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
