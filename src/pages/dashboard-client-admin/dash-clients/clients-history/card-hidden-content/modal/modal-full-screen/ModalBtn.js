import { useState } from "react";
import PropTypes from "prop-types";
import useData, { useBizData } from "init";
import { useVar } from "init/var";
import showToast from "components/toasts";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ModalFullScreen from "./ModalFullScreen";

ModalBtn.propTypes = {
    modalData: PropTypes.object.isRequired,
    setSelectedValue: PropTypes.func,
};

// Comp exclusive to "VER PERFIL"
export default function ModalBtn({
    modalData,
    button,
    setSelectedValue,
    setRun,
    run,
}) {
    const [open, setOpen] = useState(false);

    const dataPolls = useVar("polls");
    const xp = dataPolls ? dataPolls.xp : 0;
    const nps = dataPolls ? dataPolls.nps : 0;
    const { countCliUsers } = useBizData();

    const isBtnBlock = countCliUsers < 100 || !nps || nps < 0 || !xp || xp < 6;

    const {
        title,
        position,
        variant,
        iconFontAwesome,
        iconMarginLeft,
        shadowColor,
        top,
        left,
        backgroundColor,
        size,
        iconMu,
    } = button;

    const onOpen = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        // setSelectedValue(value); using redux update instead
    };

    return (
        <div>
            <ButtonFab
                title={title}
                iconFontAwesome={iconFontAwesome}
                iconMu={iconMu}
                iconMarginLeft={iconMarginLeft}
                shadowColor={shadowColor}
                backgroundColor={backgroundColor}
                onClick={
                    isBtnBlock
                        ? () =>
                              showToast(
                                  "Para ter acesso aos dados cadastrais dos clientes, você precisa ter os critérios mínimos de segurança indo em ajustes > dados projetos.",
                                  { dur: 15000 }
                              )
                        : onOpen
                }
                position={position}
                variant={variant}
                size={size}
            />
            <ModalFullScreen
                open={open}
                onClose={onClose}
                modalData={modalData}
                setRun={setRun}
                run={run}
            />
        </div>
    );
}
