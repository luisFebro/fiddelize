import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../buttons/CloseButton';
import Dialog from '@material-ui/core/Dialog';

ModalFullContent.propTypes = {
    contentComp: PropTypes.node,
    fullOpen: PropTypes.bool,
    setFullClose: PropTypes.func,
}

export default function ModalFullContent({
    contentComp,
    fullOpen = false,
    setFullClose }) {
    return (
        <Dialog
            PaperProps={{ style: {backgroundColor: 'var(--mainWhite)', maxWidth: '500px', overflowX: 'hidden'}}}
            maxWidth="md"
            fullWidth
            style={{ zIndex: 3000, overflowX: 'hidden', }}
            fullScreen={true}
            open={fullOpen}
            aria-labelledby="form-dialog-title"
            className="animated rollIn faster"
            onScroll={null}
        >
            {contentComp}
            <CloseButton
                onClick={() => setFullClose(!fullOpen)}
                size="40px"
                top="15px"
                right="15px"
            />
        </Dialog>
    );
}