import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import {
    useClientAdmin,
    useAppSystem,
    useProfile,
} from "../../hooks/useRoleData";
import { logout } from "../../redux/actions/authActions";
import { useStoreDispatch } from "easy-peasy";
import isThisApp from "../../utils/window/isThisApp";
import ButtonMenu from "../../components/buttons/material-ui/button-menu/ButtonMenu";
import ModalFullContent from "../../components/modals/ModalFullContent";
import { Load } from "../../components/code-splitting/LoadableComp";
import { setVar, store } from "../../hooks/storage/useVar";
// ICONS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
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
    const { businessId } = useAppSystem();
    const { role, name } = useProfile();
    const { bizCodeName, bizName, bizPlan } = useClientAdmin();

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
            callback: () =>
                history.push(
                    `/${bizCodeName}/compartilhar-app?negocio=${bizName}&id=${businessId}&role=${role}&adminName=${name}`
                ),
        },
        {
            icon: <FontAwesomeIcon icon="mobile-alt" style={menuIconStyle} />,
            text: "testar apps",
            callback: () => handleFullOpen("testModal"),
        },
        {
            icon: <FontAwesomeIcon icon="sync-alt" style={menuIconStyle} />,
            text: "trocar app",
            callback: () => history.push("/painel-de-apps"),
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
                (async () => {
                    await setVar({ success: false }, store.user);
                    logout(dispatch, { needReload: true });
                })();
            },
        },
    ];

    if (!isApp) optArray.splice(1, 1); // remove testar apps for larger devices...

    const locationNow = location.pathname;
    const dispatch = useStoreDispatch();
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
(bizCodeName, bizName, role) this will produces crazy results.crazy
({ bizCodeName, bizName, role }) OKAY
*/
