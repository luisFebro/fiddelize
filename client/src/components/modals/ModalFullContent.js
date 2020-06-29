import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../buttons/CloseButton';
import RadiusBtn from '../buttons/RadiusBtn';
import Dialog from '@material-ui/core/Dialog';

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

    let defaultStyle = { zIndex: 3000, overflowX: 'hidden', };
    // Not working
    // if(style) {
    //     defaultStyle = { ...defaultStyle, ...style };
    // }
    return (
        <Dialog
            PaperProps={{ style: {backgroundColor: 'var(--mainWhite)', maxWidth: '500px', overflowX: 'hidden'}}}
            maxWidth="md"
            fullWidth
            style={defaultStyle}
            fullScreen={true}
            open={fullOpen}
            aria-labelledby="form-dialog-title"
            className={`${animatedClass || "animated fadeInUp normal"}`}
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