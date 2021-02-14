import { useState, useEffect } from "react";
import ModalFullContent from "../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../components/code-splitting/LoadableComp";

// change webpackMode: "eager" to "lazy" to production. This is because it is delaying to load wiin lazy mode.
const AsyncNoCredits = Load({
    loader: () =>
        import(
            "./AsyncNoCredits" /* webpackChunkName: "denial-page-lazy", webpackMode: "eager", webpackIgnore: false */
        ),
});
const AsyncChargeCredits = Load({
    loader: () =>
        import(
            "./AsyncChargeCredits" /* webpackChunkName: "denial-page-lazy", webpackMode: "eager", webpackIgnore: false */
        ),
});

export default function AccessDenialModal({
    whichDenial = null,
    currBalance,
    totalRecipients,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncDenialPage =
        whichDenial === "NoCredits" ? (
            <AsyncNoCredits />
        ) : (
            <AsyncChargeCredits
                currBalance={currBalance}
                totalRecipients={totalRecipients}
            />
        );

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    useEffect(() => {
        if (whichDenial) {
            handleFullOpen();
        }
    }, [whichDenial]);

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        whichDenial && (
            <section>
                <ModalFullContent
                    contentComp={AsyncDenialPage}
                    fullOpen={fullOpen}
                    setFullOpen={handleFullClose}
                    needIndex={false}
                />
            </section>
        )
    );
}
