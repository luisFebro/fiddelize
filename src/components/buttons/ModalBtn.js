import { useState, Fragment } from "react";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import PropTypes from "prop-types";
import ButtonFab from "./material-ui/ButtonFab";
import ModalFullContent from "../modals/ModalFullContent";

ModalBtn.propTypes = {
    modalComp: PropTypes.node,
    btnComp: PropTypes.node,
    btnConfig: PropTypes.shape({}),
};

export default function ModalBtn({ onClick, modalComp, btnComp, btnConfig }) {
    const [closeBtn, setShowCloseBtn] = useState(false);
    const [fullOpen, setFullOpen] = useState(false);
    const [needOpen, setNeedOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const styleIcon = { fontSize: 30, color: "fff" };

    return (
        <section>
            {btnComp ? (
                <Fragment>{btnComp}</Fragment>
            ) : (
                <ButtonFab
                    position="relative"
                    onClick={handleFullOpen}
                    backgroundColor="var(--themeSDark)"
                    iconMu={
                        <WhatshotIcon
                            className="d-flex align-items-center"
                            style={styleIcon}
                        />
                    }
                    needIconShadow={false}
                />
            )}
            <ModalFullContent
                contentComp={modalComp}
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
            />
        </section>
    );
}
