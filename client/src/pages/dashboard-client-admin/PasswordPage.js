import React, { useState } from 'react';
import getQueryByName from '../../utils/string/getQueryByName';
import ToggleVisibilityPassword from '../../components/forms/fields/ToggleVisibilityPassword';

export default function PasswordPage({ location }) {
    const [data, setData] = useState({
        verificationPass: '',
    })

    const { verificationPass } = data;
    const bizId = getQueryByName("id", location.search);

    const showVerificationPassField = () => (
        <div className="mt-4">
            <p className="text-normal font-weight-bold">Mudar senha de verificação:</p>
            <div style={{margin: 'auto', width: '60%'}}>
                <ToggleVisibilityPassword
                    showForgotPass={false}
                    onChange={null}
                    setData={setData}
                    data={data}
                    label=" "
                    name="verificationPass"
                    value={verificationPass}
                />
            </div>
        </div>
    );

    return (
        <div className="text-white">
            I'm the password Verification Page
            bizId is {bizId}
            {showVerificationPassField()}
        </div>
    );
}