import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useBizData } from "init";
import disconnect from "auth/disconnect";
import isThisApp from "utils/window/isThisApp";
import ButtonMenu from "components/buttons/material-ui/button-menu/ButtonMenu";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
// ICONS
// END ICONS

export const menuIconStyle = {
    fontSize: "30px",
};

const isApp = isThisApp();

// ASYNC MODAL CONTENTS
const AsyncFiddelizeContact = Load({
    loader: () =>
        import(
            "./comps/FiddelizeContact" /* webpackChunkName: "fiddelize-contact-modal-lazy" */
        ),
});

const AsyncTestMode = Load({
    loader: () =>
        import(
            "./modal-test-mode/AsyncTestModeContent" /* webpackChunkName: "test-mode-page-lazy" */
        ),
});

const modalStore = {
    testModal: <AsyncTestMode />,
    contactModal: <AsyncFiddelizeContact />,
};
// END ASYNC MODAL CONTENTS

export default function MoreOptionsMenu({ location, history }) {
    const [currModal, setCurrModal] = useState("");
    const [fullOpen, setFullOpen] = useState(false);
    const { bizLinkName } = useBizData();

    const handleFullOpen = (modalName) => {
        setCurrModal(modalName);
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
        setCurrModal("");
    };

    const optArray = [
        {
            icon: <FontAwesomeIcon icon="share-alt" style={menuIconStyle} />,
            text: "compartilhar apps",
            callback: () => history.push(`/${bizLinkName}/compartilhar-app`),
        },
        {
            icon: <FontAwesomeIcon icon="sync-alt" style={menuIconStyle} />,
            text: "trocar app",
            callback: () => history.push("/painel-de-apps"),
        },
        {
            icon: <FontAwesomeIcon icon="mobile-alt" style={menuIconStyle} />,
            text: "demo",
            callback: () => handleFullOpen("testModal"),
        },
        {
            icon: <FontAwesomeIcon icon="comment" style={menuIconStyle} />,
            text: "fale conosco",
            callback: () => handleFullOpen("contactModal"),
        },
        {
            icon: <ExitToAppIcon style={menuIconStyle} />,
            text: "sair",
            callback: () => {
                disconnect({ msg: true });
            },
        },
    ];

    if (!isApp) optArray.splice(1, 1); // remove testar apps for larger devices...

    const locationNow = location.pathname;
    if (locationNow.includes("/cliente-admin/painel-de-controle")) {
        return (
            <Fragment>
                <ButtonMenu
                    optionsArray={optArray}
                    mainIcon="hamburger"
                    whiteRipple
                />
                {currModal && (
                    <ModalFullContent
                        contentComp={modalStore[currModal]}
                        fullOpen={fullOpen}
                        backgroundColor={
                            currModal === "contactModal"
                                ? "var(--themeP)"
                                : undefined
                        }
                        setFullOpen={handleFullClose}
                    />
                )}
            </Fragment>
        );
    }

    return null;
}

/* COMMENTS
n1: LESSON: don not forget the curly braces when declaring React props;
(bizLinkName, bizName, role) this will produces crazy results.crazy
({ bizLinkName, bizName, role }) OKAY
*/
