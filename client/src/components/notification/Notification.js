import React, { Fragment } from 'react';

export default function Notification() {
    const showTitle = () => (
        <div className="my-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Novidades
            </p>
        </div>
    );

    return (
        <Fragment>
            {showTitle()}
        </Fragment>
    );
}