// this modal is automatically open when user got into the level 1 or 2 of functionality block due to expiration
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
// import UpgradeRequiredContent from "./UpgradeRequiredContent.js";

const AsyncUpgradeRequiredContent = Load({
    loader: () =>
        import(
            "./UpgradeRequiredContent.js" /* webpackChunkName: "update-required-full-page-lazy" */
        ),
});

export default function UpgradeRequiredModal({ proModal, msg, setProModal }) {
    const handleFullClose = () => {
        setProModal(false);
    };

    return (
        <ModalFullContent
            contentComp={
                <AsyncUpgradeRequiredContent
                    handleClose={handleFullClose}
                    msg={msg}
                />
            }
            fullOpen={proModal}
            setFullOpen={handleFullClose}
        />
    );
}
