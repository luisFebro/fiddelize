import { useState } from "react";
import { Load } from "components/code-splitting/LoadableComp";
import DeleteButton from "components/buttons/DeleteButton";
import ModalYesNo from "components/modals/ModalYesNo";
import showToast from "components/toasts";
import getAPI, { changeBenefit } from "api";
import { setRun, useAction } from "global-data/ui";
import getId from "utils/getId";
import useData from "init";

const AsyncUndoContent = Load({
    loading: true,
    loader: () =>
        import(
            "./UndoContent" /* webpackChunkName: "undo-content-page-lazy" */
        ),
});

export default function UndoContentBtn(props) {
    const [fullOpen, setFullOpen] = useState(false);

    const uify = useAction();
    const { userId: staffId } = useData();

    const {
        gender,
        customerName,
        // currPoints,
        targetPoints,
        benefitDesc,
    } = props;

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    console.log("props UNDO", props);
    const handleRemoval = async () => {
        const benefitBody = {
            isReceived: false,
            restorePoints: targetPoints,
            customerId: props.customerId,
            benefitId: props.benefitId,
            recordId: props.recordId,
            currChall: props.currChall,
            challTypeId: props.challTypeId,
            gameName: props.gameName,
            staff: {
                name: props.doneBy,
            },
        };

        await getAPI({
            method: "put",
            url: changeBenefit(),
            body: benefitBody,
            params: { userId: staffId }, // for token verify
        });

        const uniqueId = getId();
        setRun("runName", `DoneBenefitsList${uniqueId}`, uify);

        showToast(
            `A aplicação do benefício (${benefitDesc}) d${
                gender === "Ele" ? "o" : "a"
            } cliente ${
                customerName && customerName.toUpperCase()
            } foi revertida e pontos restaurados`,
            { type: "success" }
        );
        handleFullClose();
    };

    return (
        <section>
            <DeleteButton
                bottom={10}
                right={15}
                transform="scale(0.9)"
                onClick={handleFullOpen}
            />
            <ModalYesNo
                title="Remoção de Benefício Realizado"
                setFullOpen={setFullOpen}
                fullOpen={fullOpen}
                actionFunc={handleRemoval}
                contentComp={<AsyncUndoContent />}
                marginCTA=" "
            />
        </section>
    );
}
