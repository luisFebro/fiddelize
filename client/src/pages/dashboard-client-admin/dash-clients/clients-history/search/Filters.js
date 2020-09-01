import React from 'react';
import AnimaIconsSelect from '../../../../../components/selects/anima-icons-select/AnimaIconsSelect';

export default function Filters({
    listTotal, handleSelectedFilter, loading
}) {

    const showCategories = () => (
        listTotal !== 0 &&
        <section className="my-5 text-p position-relative text-normal text-left pl-2 font-weight-bold">
            Organize por:
            <br />
            <AnimaIconsSelect
                callback={handleSelectedFilter}
                loading={loading}
            />
        </section>
    );

    return (
        <section>
            {showCategories()}
        </section>
    );
}
