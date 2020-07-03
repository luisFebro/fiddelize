import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../buttons/CloseButton';
import RadiusBtn from '../buttons/RadiusBtn';
import Dialog from '@material-ui/core/Dialog';
import { useRunComp } from '../../hooks/useRunComp';

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
}) {
    const { runName } = useRunComp();
    let defaultStyle = { zIndex: 3000, overflowX: 'hidden', };
    const handleOpen = () => {
        if(runName === "closeModalFullContent") return false;
        return fullOpen;
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
                    top="15px"
                    right="15px"
                />
            )}
        </Dialog>
    );
}

ModalFullContent.whyDidYouRender = false;