import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBizData } from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalConfYesNo from "components/modals/ModalYesNo";
import showToast from "components/toasts";
import getAPI, { removeUser, countField } from "api";
import { setRun, useAction } from "global-data/ui";

export default function RemoveMemberBtn({ modalData }) {
    const [fullOpen, setFullOpen] = useState(false);

    const uify = useAction();

    const { name, _id } = modalData;

    const { bizId } = useBizData();

    const onOpen = () => {
        setFullOpen(true);
    };

    const onClose = () => {
        setFullOpen(false);
    };

    const handleRemoval = (itemData) => {
        showToast("Processando...");
        setTimeout(() => showToast(`Excluindo membro ${name}...`), 2900);
        setTimeout(() => {
            getAPI({
                method: "delete",
                url: removeUser(_id),
                params: { userId: bizId, thisRole: "cliente-membro" },
                fullCatch: true,
            })
                .then(() => {
                    getAPI({
                        method: "put",
                        url: countField(bizId, "cliente-admin"),
                        fullCatch: true,
                        body: {
                            field: "clientAdminData.totalClientUsers",
                            type: "dec",
                            thisRole: "cliente-admin",
                        },
                    })
                        .then(() => {
                            showToast(
                                `Cliente ${name} foi excluído dos seus registros!`,
                                { type: "success" }
                            );
                            setRun("runName", "teamMemberList", uify);
                        })
                        .catch((err) =>
                            showToast(err.data.msg, { type: "error" })
                        );
                })
                .catch((err) => {
                    // if (res.status !== 200)
                    showToast("Membro excluído com sucesso.", {
                        type: "error",
                    });
                });
        }, 5900);
    };

    return (
        <section>
            <ButtonFab
                position="relative"
                size="small"
                title="excluir"
                iconFontAwesome={<FontAwesomeIcon icon="trash-alt" />}
                backgroundColor="var(--expenseRed)"
                onClick={onOpen}
                variant="extended"
            />
            <ModalConfYesNo
                title="Confirmação<br />de Exclusão de Membro"
                subTitle={`Nota: o crédito usado não é reutilizado. Confirmado a exclusão de:<br /><strong>${name}</strong> ?`}
                setFullOpen={setFullOpen}
                fullOpen={fullOpen}
                actionFunc={handleRemoval}
            />
        </section>
    );
}
