// this modal is automatically open when user got into the level 1 or 2 of functionality block due to expiration
import ModalFullContent from "components/modals/ModalFullContent";
import { useState } from "react";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncContent = Load({
    loader: () =>
        import(
            "./FuncExpModalContent" /* webpackChunkName: "plan-func-exp-full-page-lazy" */
        ),
});

export default function FuncExpModal() {
    const [fullOpen, setFullOpen] = useState(true);

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <ModalFullContent
            contentComp={<AsyncContent handleClose={handleFullClose} />}
            fullOpen={fullOpen}
            setFullOpen={handleFullClose}
        />
    );
}
