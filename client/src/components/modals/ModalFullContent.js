import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../buttons/CloseButton';
import Dialog from '@material-ui/core/Dialog';

ModalFullContent.propTypes = {
    contentComp: PropTypes.node,
    fullOpen: PropTypes.bool,
    setFullOpen: PropTypes.func,
    style: PropTypes.object,
}

export default function ModalFullContent({
    contentComp,
    fullOpen = false,
    setFullOpen,
    style,
    animatedClass, }) {

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
            className={`${animatedClass || "animated rollIn faster"}`}
            onScroll={null}
        >
            {contentComp}
            <CloseButton
                onClick={() => setFullOpen(!fullOpen)}
                size="40px"
                top="15px"
                right="15px"
            />
        </Dialog>
    );
}