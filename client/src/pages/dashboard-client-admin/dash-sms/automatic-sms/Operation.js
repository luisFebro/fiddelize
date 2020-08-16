import React from 'react';
import SwitchBtn from '../../../../components/buttons/material-ui/SwitchBtn'
import convertToReal from '../../../../utils/numbers/convertToReal';

export default function Operation({
    title,
    active = false,
    usage = 0,
    loading = false,
}) {
    usage = convertToReal(usage);

    const plural = usage > 1 ? "s" : "";

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
            {!loading && (
                <SwitchBtn
                    callback={handleSwitchClick}
                    defaultStatus={active}
                    disabled={false}
                />
            )}
            <div
                className={`text-normal text-center ${active ? "text-purple" : "text-grey"}`}
                style={{ lineHeight: '10px' }}
            >
                <span className="text-title">{loading ? "..." : usage} </span>
                SMS usado{plural}
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