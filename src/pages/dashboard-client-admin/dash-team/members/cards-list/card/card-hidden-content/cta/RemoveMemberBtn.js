import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBizData } from "init";
import usePro from "init/pro";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalConfYesNo from "components/modals/ModalYesNo";
import showToast from "components/toasts";
import getAPI, { removeUser } from "api";
import { setRun, useAction } from "global-data/ui";

export default function RemoveMemberBtn({ modalData }) {
    const [fullOpen, setFullOpen] = useState(false);

    const uify = useAction();

    const { name, _id } = modalData;

    const { bizId } = useBizData();
    const { isPro } = usePro();

    const onOpen = () => {
        setFullOpen(true);
    };

    const onClose = () => {
        setFullOpen(false);
    };

    const handleRemoval = (itemData) => {
        showToast("Processando...");
        setTimeout(() => showToast(`Excluindo membro ${name}...`), 2900);
        setTimeout(async () => {
            const deleteRes = await getAPI({
                method: "delete",
                url: removeUser(),
                errMsg: "Ocorreu um erro ao remover membro. Tente novamente.",
                body: {
                    role: "cliente-membro",
                    userId: bizId,
                    cliIds: _id,
                    bizId,
                    isPro,
                },
            });

            if (!deleteRes) return null;

            showToast(
                `Membro ${name && name.cap()} foi excluído da sua equipe${
                    isPro ? " e 1 crédito foi restaurado" : "."
                }`,
                { type: "success", dur: isPro ? 10000 : 7000 }
            );

            setRun("runName", "teamMemberList", uify);
        }, 5900);
    };

    const handleSubtitle = () => {
        const target = "membro";
        const defaultChunk = `Confirmado a exclusão de: <strong>${name}</strong> ?`;
        let custom = `<br /><strong>1 crédito</strong> do ${target} removido será adicionado de volta ao seu saldo em créditos`;
        if (!isPro)
            custom =
                "Na versão grátis, créditos não são restaurados. Atualize para um <strong>plano pro</strong> para restaurar créditos";

        return `Créditos Restauráveis: ${custom}<br /><br />${defaultChunk}`;
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
                title="Exclusão de Membro"
                subTitle={handleSubtitle()}
                setFullOpen={setFullOpen}
                fullOpen={fullOpen}
                actionFunc={handleRemoval}
            />
        </section>
    );
}
