import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./CashflowContent" /* webpackChunkName: "cashflow-full-page-lazy" */
        ),
});

export default function CashflowBtn({ mainData }) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncRevenueHistoryContent = <Async mainData={mainData} />;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <ButtonFab
                position="relative"
                left={20}
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark)"
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="plus"
                        className="d-flex align-items-center"
                        style={{ fontSize: 25 }}
                        needIconShadow={false}
                        onClick={null}
                    />
                }
            />
            <ModalFullContent
                contentComp={AsyncRevenueHistoryContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
