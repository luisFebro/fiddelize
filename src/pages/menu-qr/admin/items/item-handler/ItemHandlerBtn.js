import { useState, Fragment } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import LoadableVisible from "components/code-splitting/LoadableComp";
import EditButton from "components/buttons/EditButton";

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
    isEditBtn = false,
    card,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const Comp =
        type === "item" || isEditBtn ? (
            <AsyncAddItem
                handleFullClose={handleFullClose}
                isEditBtn={isEditBtn}
                card={card}
            />
        ) : (
            <AsyncAddCategory handleFullClose={handleFullClose} />
        );

    return (
        <section>
            <Fragment>
                {isEditBtn ? (
                    <EditButton onClick={handleFullOpen} zIndex=" " />
                ) : (
                    <ButtonFab
                        size="large"
                        title={type === "item" ? "novo item" : "nova categoria"}
                        backgroundColor="var(--themeSDark)"
                        onClick={handleFullOpen}
                        position="relative"
                        variant="extended"
                        iconMu={PlusIcon}
                    />
                )}
            </Fragment>
            <ModalFullContent
                contentComp={Comp}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                backgroundColor={
                    type === "item" ? "var(--themePDark)" : "transparent"
                }
                fullScreen={type === "item"}
                needIndex={type === "item" ? 11000 : 3000} // need 11000 to open edit options when fullscreen
            />
        </section>
    );
}
