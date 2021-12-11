import { useState, Fragment } from "react";
import RadiusBtn from "components/buttons/RadiusBtn";
import { Load } from "components/code-splitting/LoadableComp";
import showToast from "components/toasts";

const AsyncModalYesNo = Load({
    loader: () =>
        import(
            "components/modals/ModalYesNo" /* webpackChunkName: "yes-no-modal-lazy" */
        ),
});

export default function FinishSubjectBtn({ subject, roomId, socket }) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const markSupportOver = async () => {
        socket.emit("finishSubject", roomId);

        showToast(`Assunto ${subject} finalizado com sucesso!`, {
            type: "success",
        });
    };

    return (
        <Fragment>
            <RadiusBtn
                position="relative"
                backgroundColor="var(--themePLight)"
                title="finalizar"
                bottom={-15}
                right={50}
                size="extra-small"
                onClick={handleFullOpen}
            />
            {fullOpen && (
                <AsyncModalYesNo
                    title="Finalização de assunto"
                    subTitle={`<span>Finalizar e arquivar o assunto <strong>${subject}</strong>?</span>`}
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    actionFunc={markSupportOver}
                />
            )}
        </Fragment>
    );
}
