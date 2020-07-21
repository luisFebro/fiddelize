import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../buttons/CloseButton';
import RadiusBtn from '../buttons/RadiusBtn';
import Dialog from '@material-ui/core/Dialog';
import { useRunComp } from '../../hooks/useRunComp';
import ButtonMulti from '../../components/buttons/material-ui/ButtonMulti';

ModalFullContent.propTypes = {
    contentComp: PropTypes.node,
    setFullOpen: PropTypes.func,
    style: PropTypes.object,
}

export default function ModalFullContent({
    contentComp,
    fullOpen,
    setFullOpen,
    style,
    animatedClass,
    exitBtn,
    showBackBtn = false,
}) {
    const { runName } = useRunComp();
    let defaultStyle = { zIndex: 3000, overflowX: 'hidden', };
    const handleOpen = () => {
        if(runName === "closeModalFullContent") return false;
        return fullOpen;
    }

    const handleModalClose = () => {
        setFullOpen(prevStatus => !prevStatus);
    }

    return (
        <Dialog
            PaperProps={{ style: {backgroundColor: 'var(--mainWhite)', maxWidth: '500px', overflowX: 'hidden'}}}
            maxWidth="md"
            fullWidth
            style={defaultStyle}
            fullScreen={true}
            open={handleOpen()}
            aria-labelledby="form-dialog-title"
            className={`${animatedClass || ""}`}
            onScroll={null}
        >
            {contentComp}
            {exitBtn === "text"
            ? (
                <RadiusBtn
                    position="fixed"
                    onClick={setFullOpen}
                    top={0}
                    right={15}
                    title="voltar"
                    backgroundColor="black"
                    size="extra-small"
                />
            ) : (
                <CloseButton
                    onClick={setFullOpen}
                    size="40px"
                    top="10px"
                    right="10px"
                />
            )}

            {showBackBtn && (
                <div className="my-4 container-center">
                    <ButtonMulti
                        title="Voltar"
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeP)"
                        onClick={handleModalClose}
                    />
                </div>
            )}
        </Dialog>
    );
}

ModalFullContent.whyDidYouRender = false;