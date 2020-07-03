import React, { useState } from 'react';
import ButtonFab from '../../../../../../../components/buttons/material-ui/ButtonFab';
import PropTypes from 'prop-types';
import ModalTextField from './ModalTextField';
import { buttonFabType } from '../../../../../../../types';
import handleChange from '../../../../../../../utils/form/use-state/handleChange';
import { setRun } from '../../../../../../../hooks/useRunComp';
import { useStoreDispatch } from 'easy-peasy';

ModalBtn.propTypes = {
    modalData: PropTypes.object.isRequired,
    button: PropTypes.shape(buttonFabType),
    setSelectedValue: PropTypes.func,
}

export default function ModalBtn({
    modalData, button, setSelectedValue }) {
    const [open, setOpen] = useState(false);

    const dispatch = useStoreDispatch();

    const {
        title,
        iconFontAwesome,
        variant,
        top,
        left,
        backgroundColor,
        position,
        size,
        needCloseOtherModals, } = button;

    const onOpen = () => {
      setOpen(true);
    };

    const onClose = () => {
      setOpen(false);
      // setSelectedValue(value); using redux update instead
    };

    const handleCloseModals = () => {
        needCloseOtherModals && setRun(dispatch, "closeModalFullContent");
    }

    return (
        <div>
            <ButtonFab
                title={title}
                iconFontAwesome={iconFontAwesome}
                variant={variant}
                top={top}
                left={left}
                backgroundColor={backgroundColor}
                onClick={onOpen}
                position={position}
                size={size}
            />
            <ModalTextField
                open={open}
                onClose={onClose}
                modalData={modalData}
                closeOtherModals={handleCloseModals}
            />
        </div>
    );
}