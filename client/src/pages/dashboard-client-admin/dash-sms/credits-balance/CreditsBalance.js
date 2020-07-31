import React from 'react';
import AddSMSBtn from './add-sms-btn/AddSMSBtn';
import { convertDotToComma } from '../../../../utils/numbers/convertDotComma';

const isSmall = window.Helper.isSmallScreen();

export default function CreditsBalance() {
    const smsBalance = convertDotToComma(1.554, { needFixed: false });
    return (
        <section className="mt-5 my-3">
            <div className="container-center">
                <div className="position-relative text-title text-purple text-center">
                    Saldo:
                    <span
                        className="d-inline-block ml-2 font-size text-em-1-5"
                        style={{minWidth: '114px'}}
                    >
                        {smsBalance}
                    </span>
                    <p
                        className="position-absolute m-0 text-subtitle font-weight-bold text-purple text-center"
                        style={{top: isSmall ? '50px' : '70px', right: '0px'}}
                    >créditos</p>
                </div>
                <AddSMSBtn />
            </div>
        </section>
    );
}