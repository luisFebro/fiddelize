import { useState } from "react";
import RadiusBtn from "components/buttons/RadiusBtn";
import EditCategoryTitle from "./EditCategoryTitle";
import FinalList from "./FinalList";
// import { useBizData } from "init";
// import getItems, { setItems } from "init/lStorage";

export default function CategoryList({
    category,
    updateItem,
    setFullOpen = () => null,
    closeCategoryForm = () => null,
    isAddCategory = false,
    // menuData,
}) {
    const [dataList, setDataList] = useState({
        type: isAddCategory ? "addCat" : "onlyCat",
    });
    const { type } = dataList;
    const isAddCat = type === "addCat";
    const isCatOnly = type === "onlyCat";

    const catTitle = category === "_general" ? "gerais" : category;

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
            </h2>
        );
    };

    // ultimateList = isAddCat
    //     ? ultimateList
    //     : ultimateList && ultimateList.filter((item) => item.category === category);

    // ultimateList = removeObjDuplicate(ultimateList);

    // useEffect(() => {
    //     // update list when user scroll by detecting the size of it.
    //     if (dbCategories) {
    //         setDataList((prev) => ({
    //             ...prev,
    //             ultimateList: list,
    //             allCategories: dbCategories,
    //         }));
    //     }
    //     // insert dbCategories ccauses max depth error
    //     // eslint-disable-next-line
    // }, [list.length]);

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

    return (
        <section className="mx-3 text-center my-5 text-white text-hero">
            {showTitle()}
            {isCatOnly && showEditCategory()}
            <FinalList
                category={category}
                setDataList={setDataList}
                updateItem={updateItem}
                isAddCat={isAddCat}
                setFullOpen={setFullOpen}
                closeCategoryForm={closeCategoryForm}
            />
        </section>
    );
}

/*
// set future updates to hide items
<DeleteButton
    onClick={null}
/>

 */
