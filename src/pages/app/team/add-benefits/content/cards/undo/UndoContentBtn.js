import { useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import DeleteButton from "components/buttons/DeleteButton";
import ModalConfYesNo from "components/modals/ModalYesNo";

const AsyncUndoContent = Load({
    loading: true,
    loader: () =>
        import(
            "./UndoContent" /* webpackChunkName: "undo-content-page-lazy" */
        ),
});

export default function UndoBtn(props) {
    const [fullOpen, setFullOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const handleRemoval = () => {
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
            <ModalConfYesNo
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
