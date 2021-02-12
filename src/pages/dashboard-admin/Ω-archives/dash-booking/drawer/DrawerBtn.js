import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ButtonMulti from '../../../../components/buttons/material-ui/ButtonMulti';
import SideBar from './SideBar';

DrawerBtn.propTypes = {
    drawer: PropTypes.object,
    button: PropTypes.object,
}

// FIND: DashBooking.js
export default function DrawerBtn({ drawer, button }) {
    const [open, setOpen] = useState(false);

    const {
        title,
        iconFontAwesome,
        variant,
        size,
        backgroundColor,
        backColorOnHover } = button;


    const onOpen = () => {
      setOpen(true);
    };

    const onClose = () => {
      setOpen(false);
    };

    return (
        <div>
            <ButtonMulti
                title={title}
                iconFontAwesome={iconFontAwesome}
                variant={variant}
                backgroundColor={backgroundColor}
                backColorOnHover={backColorOnHover}
                onClick={onOpen}
            />
            <SideBar
                drawer={drawer}
                open={open}
                onClose={onClose}
            />
        </div>
    );
}