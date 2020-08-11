import React from 'react';
import SwitchBtn from '../../../../components/buttons/material-ui/SwitchBtn'
import convertToReal from '../../../../utils/numbers/convertToReal';

export default function Operation({
    title, isOn = false, usage = 1200, disabled = false,
}) {
    usage = convertToReal(usage);

    const handleSwitchClick = () => {
        //null
    }

    const showTitle = () => (
        <div
            className="ml-3 text-justify text-small text-purple font-weight-bold"
        >
            {title}
        </div>
    );

    const showSwitchBtn = () => (
        <section className="mr-3">
            <SwitchBtn
                callback={handleSwitchClick}
                defaultStatus={isOn}
                disabled={disabled}
            />
            <div
                className={`text-normal text-center ${isOn ? "text-purple" : "text-grey"}`}
                style={{ lineHeight: '10px' }}
            >
                <span className="text-title">{usage} </span>
                SMS usados
            </div>
        </section>
    );

    return (
        <section className="d-flex mb-5">
            {showTitle()}
            {showSwitchBtn()}
        </section>
    );
}