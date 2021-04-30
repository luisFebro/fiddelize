import { useState } from "react";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";
import ModalFullContent from "../../../../../../components/modals/ModalFullContent";
import { Load } from "../../../../../../components/code-splitting/LoadableComp";
import { useBizData } from "init";

const Async = Load({
    loading: true,
    loader: () =>
        import(
            "./QrInvitationModal" /* webpackChunkName: "qr-invitation-full-page-lazy" */
        ),
});

export default function QrInvitationBtn({ qrValue, cliName, isNewMember }) {
    const [fullOpen, setFullOpen] = useState(false);

    const {
        selfBizLogoImg: img,
        selfThemeBackColor: backColor,
        selfThemePColor: fgColor,
        selfThemeSColor: sColor,
        bizName,
    } = useBizData();

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const AsyncQrInvitationModal = (
        <Async
            qrValue={qrValue}
            cliName={cliName}
            img={img}
            fgColor={fgColor}
            sColor={sColor}
            bizName={bizName}
            handleFullClose={handleFullClose}
            isNewMember={isNewMember}
        />
    );

    return (
        <section>
            <ButtonFab
                size="medium"
                title="Abrir Código QR"
                onClick={handleFullOpen}
                backgroundColor="var(--themeSDark)"
                variant="extended"
                position="relative"
            />
            <ModalFullContent
                contentComp={AsyncQrInvitationModal}
                fullOpen={fullOpen}
                setFullOpen={handleFullClose}
                needIndex={false}
                backgroundColor={`var(--themeBackground--${backColor})`}
            />
        </section>
    );
}
