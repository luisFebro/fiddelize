import { useState } from "react";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalYesNo from "components/modals/ModalYesNo";
import showToast from "components/toasts";
import getAPI, { removePoints } from "api";
import { setRun, useAction } from "global-data/ui";
import getId from "utils/getId";
import useData from "init";
import getFirstName from "utils/string/getFirstName";

const AsyncPtsRemovalPanel = Load({
    loading: true,
    loader: () =>
        import(
            "./PtsRemovalPanel" /* webpackChunkName: "pts-removal-panel-lazy" */
        ),
});

export default function PtsRemovalPanelBtn({ clientId, clientName, value }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [needBackBtn, setNeedBackBtn] = useState(true);
    const [selectedData, setSelected] = useState({
        selected: "",
        comment: "", // only for custom type
    });
    const { comment, selected } = selectedData;

    const uify = useAction();
    const { userId: staffId, name: staffName, role: staffRole } = useData();
    const [staffJob] = useData(["memberJob"], { dots: false });

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const handleRemoval = async () => {
        const isCustom = selected === "Escrever Motivo";
        const isCommentEmpty = !comment && isCustom;
        if (isCommentEmpty)
            return showToast(
                "Você precisa escrever um motivo. Favor, recarregue a lista.",
                { type: "error", dur: 10000 }
            );

        const removalBody = {
            userId: staffId, // staff's current logged in id for auth check only
            customerId: clientId,
            removalPoints: value,
            desc: isCustom ? comment : selected,
            staff: {
                id: staffId,
                name: staffName,
                role: staffRole,
                job: staffJob || "admin",
            },
        };

        await getAPI({
            method: "delete",
            url: removePoints(),
            body: removalBody,
            errMsg: true,
        });

        const uniqueId = getId();
        setRun("runName", `AsyncTeamTasksList${uniqueId}`, uify);

        showToast(
            `A quantidade de ${value} PTS foi removida da carteira de pontos do cliente ${getFirstName(
                clientName && clientName.toUpperCase(),
                { addSurname: true }
            )}`,
            { type: "success", dur: 10000 }
        );

        return handleFullClose();
    };

    return (
        <section>
            <ButtonFab
                title="remover PTS"
                position="relative"
                variant="extended"
                size="small"
                iconFontAwesome={<FontAwesomeIcon icon="trash-alt" />}
                backgroundColor="var(--expenseRed)"
                onClick={handleFullOpen}
            />
            <ModalYesNo
                title="Remoção de PTS"
                setFullOpen={setFullOpen}
                fullOpen={fullOpen}
                actionFunc={handleRemoval}
                contentComp={
                    <AsyncPtsRemovalPanel
                        setNeedBackBtn={setNeedBackBtn}
                        selected={selected}
                        setSelected={setSelected}
                    />
                }
                marginCTA=" "
                needBackBtn={needBackBtn}
                needIndex={false}
            />
        </section>
    );
}
