import React from 'react';
import AnimaIconsSelect from '../../../../../components/selects/anima-icons-select/AnimaIconsSelect';

export default function Filters({ listTotal }) {
    const showSelect = () => (
        <AnimaIconsSelect/>
    );

    const showFilteredListTitle = () => (
        listTotal !== 0 &&
        <p style={{top: '40px'}} className="text-p position-relative text-normal text-left pl-2 font-weight-bold">
            Últimos Registros:
        </p>
    );

    return (
        <section>
            {showSelect()}
            {showFilteredListTitle()}
        </section>
    );
}
