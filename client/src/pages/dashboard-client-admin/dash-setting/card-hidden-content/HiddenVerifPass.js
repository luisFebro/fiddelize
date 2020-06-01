import React from 'react';
import ShowPasswordForm from '../../ShowPasswordForm';
// import DateWithIcon from '../../../../components/date-time/DateWithIcon';

// TEST
// let date = new Date();
// const daysBefore = 2;
// date.setDate(date.getDate() - daysBefore);
// END

export default function HiddenVerifPass({ userData }) {
    return (
        <div className="hidden-content--root text-normal">
            <ShowPasswordForm isFromCliAdminDash={true} />
        </div>
    );
}

/* ARCHIVES
wrong date because lack of time recording in db
<DateWithIcon
    date={userData.updatedAt}
    msgIfNotValidDate="Nenhuma alteração."
/>
*/