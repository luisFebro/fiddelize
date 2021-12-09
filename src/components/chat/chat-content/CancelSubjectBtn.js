import { useState, Fragment } from "react";
import RadiusBtn from "components/buttons/RadiusBtn";
import { Load } from "components/code-splitting/LoadableComp";
import getAPI, { updateSupport } from "api";
import { removeItems } from "init/lStorage";
import showToast from "components/toasts";

const AsyncModalYesNo = Load({
    loader: () =>
        import(
            "components/modals/ModalYesNo" /* webpackChunkName: "yes-no-modal-lazy" */
        ),
});

export default function CancelSubjectBtn({
    subject,
    roomId,
    userId,
    updateChatList,
}) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const markSupportOver = async () => {
        const params = {
            roomId,
            userId,
        };
        const body = {
            "dataType.isPendingSupport": false,
            updatedAt: new Date(),
        };

        await getAPI({
            method: "POST",
            url: updateSupport(),
            body,
            params,
        }).catch(() => {
            showToast("Ocorreu um erro ao finalizar assunto.");
        });

        removeItems("global", ["chatPreventMainPanel"]);
        updateChatList();
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
