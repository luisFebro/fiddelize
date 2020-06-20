import React, { useState, Fragment } from 'react';
import ButtonFab from './material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloseButton from './CloseButton';
import ModalFullContent from '../modals/ModalFullContent';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import PropTypes from 'prop-types';

ModalBtn.propTypes = {
    modalComp: PropTypes.node,
    btnComp: PropTypes.node,
    btnConfig: PropTypes.shape({

    }),
}

export default function ModalBtn({
    onClick, modalComp, btnComp, btnConfig }) {
    const [closeBtn, setShowCloseBtn] = useState(false);
    const [fullOpen, setFullOpen] = useState(false);
    const [needOpen, setNeedOpen] = useState(false);

    const handleFullOpen = () => {
        setFullOpen(true);
    }

    return (
        <section>
            {btnComp ? (
                <Fragment>
                    {btnComp}
                </Fragment>
            ) : (
                <ButtonFab
                    position="relative"
                    onClick={handleFullOpen}
                    backgroundColor="var(--themeSDark)"
                    iconMu={<WhatshotIcon className="d-flex align-items-center" style={{fontSize: 30, color: "fff"}} />}
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