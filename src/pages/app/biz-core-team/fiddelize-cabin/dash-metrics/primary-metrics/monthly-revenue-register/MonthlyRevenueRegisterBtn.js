import { useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const Async = Load({
    loading: true,
    loader: () =>
        import(
            "./MonthlyRevenueRegisterContent" /* webpackChunkName: "montly-revenue-register-full-page-lazy" */
        ),
});

const muStyle = {
    transform: "scale(1.5)",
    color: "#fff",
    filter: "drop-shadow(.1px .1px .9px grey)",
};

const PlusIcon = <AddCircleOutlineIcon style={muStyle} />;

export default function MonthlyRevenueRegisterBtn({
    size = "medium",
    currMonth,
    handleNewRevenueValue,
    mainData,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncComp = (
        <Async
            currMonth={currMonth}
            handleNewRevenueValue={handleNewRevenueValue}
            mainData={mainData}
        />
    );

    return (
        <section>
            <ButtonFab
                size={size}
                title=""
                backgroundColor="var(--themeSDark)"
                onClick={handleFullOpen}
                iconMu={PlusIcon}
                position="relative"
            />
            <ModalFullContent
                contentComp={AsyncComp}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
            />
        </section>
    );
}
