import React from 'react';
import MuSelectTable from '../../../../../../../components/tables/MuSelectTable';
import ButtonFab from '../../../../../../../components/buttons/material-ui/ButtonFab';

const getStyles = () => ({
    title: {
        marginTop: 80,
    }
});

const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Nome' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Contato' },
    { id: 'carrier', numeric: false, disablePadding: false, label: 'Operadora' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
]

export default function AsyncExtract({ extractId }) {

    const styles = getStyles();

    const displayCTA = () => (
        <ButtonFab
            size="medium"
            title="Novo reenvio"
            onClick={null}
            position="relative"
            needTxtNoWrap={true}
            backgroundColor={"var(--themeSDark--default)"}
            variant = 'extended'
        />
    );

    return (
        <section className="animated fadeInUp slow delay-1s">
            <div
                className="d-flex justify-content-center"
                style={styles.title}
            >
                <p className="align-items-center mb-2 mr-3 text-subtitle font-weight-bold text-white text-shadow text-center">
                    Extrato
                </p>
                {displayCTA()}
            </div>
        </section>
    );
}

/*
<MuSelectTable
    headCells={headCells}
    rowsData={list}
    loading={loading}
    callback={checkSelected}
    emptySelection={emptySelection}
/>
 */