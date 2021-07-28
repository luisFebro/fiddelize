import { useState } from "react";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "pages/mobile-app/content/bottom-menu-contents/purchase-history/PurchaseHistory" /* webpackChunkName: "new-cli-purchase-history-full-page-lazy" */
        ),
});

const getStyles = () => ({
    muStyle: {
        transform: "scale(1.2)",
        color: "#fff",
    },
});

// Exclusive for cli-admin
export default function PurchaseHistoryBtn(props) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncPurchaseHistory = <Async {...props} />;

    const styles = getStyles();
    const MallIcon = <LocalMallIcon style={styles.muStyle} />;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                size="large"
                title="Ver Histórico"
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
                iconMu={MallIcon}
            />
            <ModalFullContent
                contentComp={AsyncPurchaseHistory}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
