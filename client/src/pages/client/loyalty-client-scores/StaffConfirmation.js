import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import StaffConf from '../../../components/loyaltyScores/StaffConf';
import HomeButton from '../../../components/buttons/HomeButton';

StaffConfirmation.propTypes = {
    success: PropTypes.bool,
    setVerification: PropTypes.func
}

export default function StaffConfirmation({ success, setVerification }) {
    return (
        success &&
        <div className="mr-md-5 ml-md-4 mt-5">
            <Fragment>
                <div className="ml-5">
                    <StaffConf success={success} setVerification={setVerification} />
                </div>
                <HomeButton />
            </Fragment>
        </div>
    );
}