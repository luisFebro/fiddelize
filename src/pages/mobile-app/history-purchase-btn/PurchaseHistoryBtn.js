import { useState } from "react";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../components/modals/ModalFullContent";
import { Load } from "../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./AsyncPurchaseHistory" /* webpackChunkName: "cli-purchase-history-full-page-lazy" */
        ),
});

const getStyles = (props) => ({
    muStyle: {
        transform: "scale(1.2)",
        filter: "drop-shadow(.5px .5px 1.5px black)",
        color: "#fff",
    },
});

export default function PurchaseHistoryBtn({
    colorS = "white",
    right,
    bottom,
    modalData,
    from = "mobileApp", // removed discount scores from client hisotry
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncPurchaseHistory = <Async modalData={modalData} />;

    const styles = getStyles();
    const MallIcon = (
        <LocalMallIcon
            style={from === "clientsHistory" ? undefined : styles.muStyle}
        />
    );

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            {from === "clientsHistory" ? (
                <ButtonFab
                    size="large"
                    title="Ver Histórico"
                    onClick={handleFullOpen}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    position="relative"
                    iconMu={MallIcon}
                />
            ) : (
                <ButtonFab
                    backgroundColor={`var(--themeSDark--${colorS})`}
                    onClick={handleFullOpen}
                    iconMu={MallIcon}
                    right={right}
                    bottom={bottom}
                    shadowColor={colorS === "black" ? "white" : "black"}
                    needBtnShadow
                />
            )}
            <ModalFullContent
                contentComp={AsyncPurchaseHistory}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
