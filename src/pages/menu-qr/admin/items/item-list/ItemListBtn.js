import { useState, Fragment } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import RadiusBtn from "components/buttons/RadiusBtn";

const AsyncCategoryList = Load({
    loader: () =>
        import(
            "./CategoryList" /* webpackChunkName: "item-list-content-lazy" */
        ),
});

export default function ItemListBtn({ sColor = "default", category }) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <Fragment>
            <RadiusBtn
                title="ver todos"
                backgroundColor={`var(--themeSDark--${sColor})`}
                onClick={handleFullOpen}
                position="relative"
                size="extra-small"
            />
            <ModalFullContent
                contentComp={
                    <AsyncCategoryList
                        category={category}
                        setFullOpen={handleFullClose}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </Fragment>
    );
}
