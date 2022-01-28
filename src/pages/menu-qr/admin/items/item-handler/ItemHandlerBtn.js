import { useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import LoadableVisible from "components/code-splitting/LoadableComp";

const AsyncAddItem = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./AddItemContent.js" /* webpackChunkName: "add-item-content-lazy" */
        ),
});

const AsyncAddCategory = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./AddCategoryContent.js" /* webpackChunkName: "add-category-content-lazy" */
        ),
});

export default function ItemHandlerBtn({
    PlusIcon,
    type = "item", // or category
    updateItem,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const Comp =
        type === "item" ? (
            <AsyncAddItem
                updateItem={updateItem}
                handleFullClose={handleFullClose}
            />
        ) : (
            <AsyncAddCategory
                updateItem={updateItem}
                handleFullClose={handleFullClose}
            />
        );

    return (
        <section>
            <ButtonFab
                size="large"
                title={type === "item" ? "novo item" : "nova categoria"}
                backgroundColor="var(--themeSDark)"
                onClick={handleFullOpen}
                position="relative"
                variant="extended"
                iconMu={PlusIcon}
            />
            <ModalFullContent
                contentComp={Comp}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                backgroundColor={
                    type === "item" ? "var(--themePDark)" : "transparent"
                }
                fullScreen={type === "item"}
                needIndex
            />
        </section>
    );
}
