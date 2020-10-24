import React, { useState } from "react";
import ModalFullContent from "../../../components/modals/ModalFullContent";
import { Load } from "../../../components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./AsyncPasswordRecoverContent" /* webpackChunkName: "password-recovery-full-page-lazy" */
        ),
});

export default function PasswordRecoverBtn({ textColor }) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncPasswordRecoverContent = <Async />;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section>
            <section
                className={`text-link text-small font-weight-normal ${textColor} text-center`}
                onClick={handleFullOpen}
            >
                Esqueci minha senha
            </section>
            <ModalFullContent
                contentComp={AsyncPasswordRecoverContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </section>
    );
}
