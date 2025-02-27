import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useBizData } from "init";
import { updateUser } from "api/frequent";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import showToast from "components/toasts";
import { useAction } from "global-data/ui";
import isThisApp from "utils/window/isThisApp";
import TestModeBtn from "../../../dashboard-client-admin/modal-test-mode/TestModeBtn";

const isApp = isThisApp();

ShowActionBtns.propTypes = {
    objToSend: PropTypes.object,
    needUpdateBtn: PropTypes.string,
    titleBeforeOk: PropTypes.string,
    titleAfterOk: PropTypes.string,
};

export const updateDashColor = async ({
    bizId,
    objToSend,
    uify,
    titleAfterOk = "Palheta de cores salva",
}) => {
    // showToast(titleBeforeOk);
    await updateUser(bizId, "cliente-admin", objToSend, {
        uify,
    }).catch((err) => showToast(err, { type: "error" }));

    showToast(titleAfterOk, { type: "success" });
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
    const uify = useAction();

    useEffect(() => {
        if (showUpdateBtn === false) {
            if (needUpdateBtn) {
                setShowUpdateBtn(true);
            }
        }
    }, [showUpdateBtn, needUpdateBtn]);

    const handleUpdateIcon = async () => {
        // showToast(titleBeforeOk);
        await updateUser(bizId, "cliente-admin", objToSend, {
            uify,
        }).catch((err) => showToast(err, { type: "error" }));

        showToast(titleAfterOk, { type: "success" });
        setShowAppBtn(true);
    };

    const conditionToShowResultBtn = !objToSend ? needUpdateBtn : showAppBtn;
    const showResultBtn = () =>
        conditionToShowResultBtn &&
        isApp && (
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
