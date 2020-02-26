import React from 'react';
import PropTypes from 'prop-types';
import StaffConf from './loyaltyScores/StaffConf';
import HomeButton from '../../../components/buttons/HomeButton';

StaffConfirmation.propTypes = {
    success: PropTypes.bool,
    setVerification: PropTypes.func
}

export default function StaffConfirmation({ success, setVerification }) {
    return (
        success &&
        <div>
            <StaffConf success={success} setVerification={setVerification} />
            <HomeButton />
        </div>
    );
}