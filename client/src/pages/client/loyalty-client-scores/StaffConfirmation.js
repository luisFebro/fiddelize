import React from 'react';
import PropTypes from 'prop-types';
import StaffConf from './loyaltyScores/StaffConf';
import HomeButton from '../../../components/buttons/HomeButton';

StaffConfirmation.propTypes = {
    success: PropTypes.bool,
    setVerification: PropTypes.func,
    valuePaid: PropTypes.number,
}

export default function StaffConfirmation({ success, setVerification, valuePaid }) {
    return (
        success &&
        <div>
            <StaffConf
                success={success}
                setVerification={setVerification}
                valuePaid={valuePaid}
            />
            <HomeButton />
        </div>
    );
}