// this modal is automatically open when user got into the level 1 or 2 of functionality block due to expiration
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncContent = Load({
    loader: () =>
        import(
            "./FuncExpModalContent" /* webpackChunkName: "plan-func-exp-full-page-lazy" */
        ),
});

export default function FuncExpModal({ expModal, setExpModal }) {
    const handleFullClose = () => {
        setExpModal(false);
    };

    return (
        <ModalFullContent
            contentComp={<AsyncContent handleClose={handleFullClose} />}
            fullOpen={expModal}
            setFullOpen={handleFullClose}
        />
    );
}
