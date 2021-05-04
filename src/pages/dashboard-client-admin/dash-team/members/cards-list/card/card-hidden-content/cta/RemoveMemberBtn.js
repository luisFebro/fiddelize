import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreDispatch } from "easy-peasy";
import { useBizData } from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalConfYesNo from "components/modals/ModalYesNo";
import showToast from "components/toasts";
import getAPI, { removeUser } from "utils/promises/getAPI";
import { countField } from "redux/actions/userActions";
import { setRun } from "hooks/useRunComp";

export default function RemoveMemberBtn({ modalData }) {
    const [fullOpen, setFullOpen] = useState(false);

    const { name, _id } = modalData;

    const dispatch = useStoreDispatch();
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
            }).then((res) => {
                if (res.status !== 200)
                    return showToast("Membro excluído com sucesso.", {
                        type: "error",
                    });
                countField(bizId, {
                    field: "clientAdminData.totalClientUsers",
                    type: "dec",
                    thisRole: "cliente-admin",
                }).then((res) => {
                    if (res.status !== 200)
                        return showToast(res.data.msg, { type: "error" });
                    showToast(
                        `Cliente ${name} foi excluído dos seus registros!`,
                        { type: "success" }
                    );
                    setRun(dispatch, "teamMemberList");
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
