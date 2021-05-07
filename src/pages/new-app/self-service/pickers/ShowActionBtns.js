import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useBizData } from "init";
import { updateUser, readClientAdmin } from "api/frequent";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import showToast from "components/toasts";

import isThisApp from "utils/window/isThisApp";
import TestModeBtn from "../../../dashboard-client-admin/modal-test-mode/TestModeBtn";

ShowActionBtns.propTypes = {
    objToSend: PropTypes.object,
    needUpdateBtn: PropTypes.string,
    titleBeforeOk: PropTypes.string,
    titleAfterOk: PropTypes.string,
};

export default function ShowActionBtns({
    objToSend,
    titleBeforeOk = "Salvando Item",
    titleAfterOk = "Item Salvo",
    needUpdateBtn,
}) {
    const [showUpdateBtn, setShowUpdateBtn] = useState(false);
    const [showAppBtn, setShowAppBtn] = useState(false);

    const { bizId } = useBizData();

    useEffect(() => {
        if (showUpdateBtn === false) {
            if (needUpdateBtn) {
                setShowUpdateBtn(true);
            }
        }
    }, [showUpdateBtn, needUpdateBtn]);

    const handleUpdateIcon = () => {
        showToast(titleBeforeOk);
        updateUser(bizId, objToSend, {
            thisRole: "cliente-admin",
        }).then((res) => {
            if (res.status !== 200)
                return showToast("Algo deu errado. Verifique sua conexão", {
                    type: "error",
                });
            readClientAdmin(bizId).then((res) => {
                if (res.status !== 200)
                    return showToast(res.data.msg, { type: "error" });
                showToast(titleAfterOk, { type: "success" });
                setShowAppBtn(true);
            });
        });
    };

    const conditionToShowResultBtn = !objToSend ? needUpdateBtn : showAppBtn;
    const showResultBtn = () =>
        conditionToShowResultBtn &&
        isThisApp() && (
            <div className="animated zoomIn">
                <TestModeBtn />
            </div>
        );

    return (
        showUpdateBtn && (
            <section className="d-flex justify-content-center animated zoomIn my-3">
                {objToSend && (
                    <ButtonMulti
                        onClick={handleUpdateIcon}
                        title="atualizar"
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeSDark)"
                        iconFontAwesome={
                            <FontAwesomeIcon icon="sync-alt" style={faStyle} />
                        }
                    />
                )}
                {showResultBtn()}
            </section>
        )
    );
}
