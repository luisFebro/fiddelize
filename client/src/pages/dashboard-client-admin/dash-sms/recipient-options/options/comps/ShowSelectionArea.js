import React from 'react';
// import TextField from '@material-ui/core/TextField';
import RadiusBtn from '../../../../../../components/buttons/RadiusBtn';
import ContactPill from './ContactPill';

const getStyles = () => ({
    field: {
        backgroundColor: '#fff',
        display: "flex",
        flexFlow: 'row wrap',
        width: '100%',
        minHeight: '50px',
        boxShadow: 'inset 0 0 0.4em grey',
    },
    root: {
        marginBottom: '50px',
    }
});

export default function ShowSelectionArea({ list = [], handleRemoveLast }) {
    const styles = getStyles();

    const plural = list && list.length === 1 ? "" : "s";

    const showField = () => (
        <section style={styles.field}>
            {list.map(user => (
                <section key={user.name} >
                    <ContactPill
                        name={user.name}
                        phone={user.phone}
                    />
                </section>
            ))}
        </section>
    );

    return (
        <section className="mt-5" style={styles.root}>
            <p className="text-center text-purple text-subtitle font-weight-bold">
                {list.length} Selecionado{plural}
            </p>
            {showField()}
            <p
                className="text-small text-grey m-0 mt-2 font-weight-bold"
            >
                Para ver número, clique no nome.
            </p>
            <div className="d-flex justify-content-end mt-1">
                <RadiusBtn
                    title="remover último"
                    backgroundColor="var(--mainDark)"
                    position="relative"
                    onClick={handleRemoveLast}
                />
            </div>
        </section>
    );
}