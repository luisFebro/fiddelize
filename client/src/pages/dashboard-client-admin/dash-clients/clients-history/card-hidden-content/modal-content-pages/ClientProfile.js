import React from 'react';
// import { fluidTextAlign } from '../../../../../../utils/string/fluidTextAlign';
import CreatedAtBr from '../../../../CreatedAtBr';
const isSmall = window.Helper.isSmallScreen();

export default function ClientProfile({ data }) {
    const {
        name,
        cpf,
        phone,
        email,
        maritalStatus,
        birthday,
        clientUserData,
        createdAt,
    } = data;

    const showMainFormData = () => {
        const infos = {
            "CPF": cpf,
            "Contato": phone,
            "Email": email,
            "Aniversário": birthday,
            "Estado Civil": maritalStatus,
        }

        const infoKeys = Object.keys(infos);
        const infoValues = Object.values(infos);

        return(
            <div className="user-select-text">
                {infoKeys.map((key, ind) => (
                    <p key={key} className="text-left ml-3">
                        <span className="font-weight-bold">• {key}:</span>
                        <br />
                        {infoValues[ind]}
                    </p>
                ))}
            </div>
        );
    }

    return (
        <div className={`container-center text-purple text-normal`}>
            {showMainFormData()}
            <CreatedAtBr createdAt={createdAt} backgroundColor="var(--mainWhite)" />
        </div>
    );
}