import React from 'react';
import AddSMSBtn from './add-sms-btn/AddSMSBtn';
import convertToReal from '../../../../utils/numbers/convertToReal';

const isSmall = window.Helper.isSmallScreen();
const getStyles = () => ({
    balance: {
        minWidth: '114px'
    },
    credits: {top: isSmall ? '50px' : '70px', right: '0px'}
});


export default function CreditsBalance() {
    const styles = getStyles();
    const smsBalance = convertToReal(1450);

    return (
        <section className="mt-5 my-3">
            <div className="container-center">
                <div className="position-relative text-title text-purple text-center">
                    Saldo:
                    <span
                        className="d-inline-block ml-2 font-size text-em-1-5"
                        style={styles.balance}
                    >
                        {smsBalance}
                    </span>
                    <p
                        className="position-absolute m-0 text-subtitle font-weight-bold text-purple text-center"
                        style={styles.credits}
                    >créditos</p>
                </div>
                <AddSMSBtn />
            </div>
        </section>
    );
}