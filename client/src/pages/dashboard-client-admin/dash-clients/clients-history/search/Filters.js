import React from 'react';

export default function Filters({ listTotal }) {

    const showFilteredListTitle = () => (
        listTotal !== 0 &&
        <p style={{top: '40px'}} className="text-p position-relative text-normal text-left pl-2 font-weight-bold">
            Últimos Registros:
        </p>
    );

    return (
        <section>
            {showFilteredListTitle()}
        </section>
    );
}
