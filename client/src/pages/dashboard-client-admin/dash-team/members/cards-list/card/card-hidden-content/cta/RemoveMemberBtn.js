import React, { useState } from "react";
import ButtonFab from "../../../../../../../../components/buttons/material-ui/ButtonFab";
import ModalConfYesNo from "../../../../../../../../components/modals/ModalYesNo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showSnackbar } from "../../../../../../../../redux/actions/snackbarActions";
import { useStoreDispatch } from "easy-peasy";
import getAPI, {
    removeUser,
} from "../../../../../../../../utils/promises/getAPI";
import { useAppSystem } from "../../../../../../../../hooks/useRoleData";
import { countField } from "../../../../../../../../redux/actions/userActions";
import { setRun } from "../../../../../../../../hooks/useRunComp";

export default function RemoveMemberBtn({ modalData }) {
    const [fullOpen, setFullOpen] = useState(false);

    const { name, _id } = modalData;

    const dispatch = useStoreDispatch();
    const { businessId } = useAppSystem();

    const onOpen = () => {
        setFullOpen(true);
    };

    // const onClose = () => {
    //     setFullOpen(false);
    // };

    const handleRemoval = (itemData) => {
        // if (itemData._id === "5e890d185162091014c53b56")
        //     return showSnackbar(
        //         dispatch,
        //         "O membro de teste não pode ser excluido.",
        //         "error"
        //     );
        showSnackbar(dispatch, "Processando...", "warning", 3000);
        setTimeout(
            () =>
                showSnackbar(
                    dispatch,
                    `Excluindo membro ${name}...`,
                    "warning",
                    5000
                ),
            2900
        );
        setTimeout(() => {
            getAPI({
                method: "delete",
                url: removeUser(_id),
                params: { userId: businessId, thisRole: "cliente-membro" },
            }).then((res) => {
                if (res.status !== 200)
                    return showSnackbar(
                        dispatch,
                        "Membro excluído com sucesso.",
                        "error"
                    );
                countField(businessId, {
                    field: "clientAdminData.totalClientUsers",
                    type: "dec",
                    thisRole: "cliente-admin",
                }).then((res) => {
                    if (res.status !== 200)
                        return showSnackbar(dispatch, res.data.msg, "error");
                    showSnackbar(
                        dispatch,
                        `Cliente ${name} foi excluído dos seus registros!`,
                        "success",
                        6000
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
                title={`Confirmação<br />de Exclusão de Membro`}
                subTitle={`Nota: o crédito usado não é reutilizado. Confirmado a exclusão de:<br /><strong>${name}</strong> ?`}
                setFullOpen={setFullOpen}
                fullOpen={fullOpen}
                actionFunc={handleRemoval}
            />
        </section>
    );
}
