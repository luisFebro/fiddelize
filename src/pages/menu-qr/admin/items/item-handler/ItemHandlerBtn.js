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
            <AsyncAddItem handleFullClose={handleFullClose} />
        ) : (
            <AsyncAddCategory handleFullClose={handleFullClose} />
        );

    return (
        <section>
            <ButtonFab
                size="large"
                title={
                    type === "item" ? "adicionar item" : "adicionar categoria"
                }
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
                backgroundColor="var(--themePDark)"
                needIndex
            />
        </section>
    );
}
