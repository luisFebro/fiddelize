import { useState, Fragment } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const Async = Load({
    loader: () =>
        import(
            "./AsyncPasswordRecoverContent" /* webpackChunkName: "password-recovery-full-page-lazy" */
        ),
});

export default function PasswordRecoverBtn({
    textColor,
    fromBlockedComp = false,
    role,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const AsyncPasswordRecoverContent = <Async role={role} />;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <Fragment>
            {fromBlockedComp ? (
                <span
                    className={`text-link ${textColor}`}
                    onClick={handleFullOpen}
                >
                    recupere a senha
                </span>
            ) : (
                <section
                    className={`text-link text-small font-weight-normal ${textColor} text-center`}
                    onClick={handleFullOpen}
                >
                    Esqueci minha senha
                </section>
            )}
            <ModalFullContent
                contentComp={AsyncPasswordRecoverContent}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
            />
        </Fragment>
    );
}
