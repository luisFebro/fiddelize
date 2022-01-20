import { useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import { useBizData } from "init";

const AsyncDiscountBenefit = Load({
    loading: true,
    loader: () =>
        import(
            "./DiscountBenefit" /* webpackChunkName: "discount-benefit-page-lazy" */
        ),
});

export default function DiscountBenefitBtn(props) {
    const {
        title = "aplicar",
        needTxtNoWrap = false,
        position = "absolute",
    } = props;
    const [fullOpen, setFullOpen] = useState(false);
    const { themeSColor } = useBizData();

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                title={title}
                size="medium"
                position={position}
                right={position === "relative" ? undefined : 15}
                bottom={position === "relative" ? undefined : 15}
                backgroundColor={`var(--themeSDark--${themeSColor})`}
                variant="extended"
                needBtnShadow
                shadowColor="white"
                onClick={handleFullOpen}
                needTxtNoWrap={needTxtNoWrap}
            />
            <ModalFullContent
                contentComp={
                    <AsyncDiscountBenefit
                        closeModal={handleFullClose}
                        {...props}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex
                backgroundColor="var(--mainWhite)"
            />
        </section>
    );
}
