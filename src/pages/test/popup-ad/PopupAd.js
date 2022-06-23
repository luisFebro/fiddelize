import { useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncPopupAdContent = Load({
    loader: () =>
        import(
            "./PopupAdContent.js" /* webpackChunkName: "popup-ad-content-full-page-lazy" */
        ),
});

export default function PopupAd({ popupOpen, setPopupOpen }) {
    const handleFullClose = () => {
        setPopupOpen(false);
    };

    return (
        <section>
            <ModalFullContent
                contentComp={
                    <AsyncPopupAdContent setPopupOpen={setPopupOpen} />
                }
                fullOpen={popupOpen}
                setFullOpen={handleFullClose}
                exitBtn={false}
                backgroundColor="var(--themeBackground)"
                animatedClass="animated fadeInUp"
                overflowY="hidden"
            />
        </section>
    );
}
