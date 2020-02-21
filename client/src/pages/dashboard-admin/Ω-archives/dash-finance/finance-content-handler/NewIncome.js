import React from 'react';
import PropTypes from 'prop-types';
import Title from '../../../../components/Title';
import SideButton from '../../../../components/buttons/SideButton';
import BalanceForm from './BalanceForm';

NewIncome.propTypes = {
    setCurrComponent: PropTypes.func,
    currComponent: PropTypes.string,
}

export default function NewIncome({
    setCurrComponent,
    currComponent,
    setRun,
    run }) {
    const styles = {
        root: {
            width: '100%',
        },
        mainContent: {
            display: 'flex',
            flexBasis: '90%',
            justifyContent: 'center',
            minHeight: 'auto' //temp
        },
    }

    const showMainContent = () => (
        <div style={styles.mainContent}>
            <BalanceForm
                setRun={setRun}
                run={run}
                setCurrComponent={setCurrComponent}
            />
        </div>
    );

    return (
        currComponent === "NewIncome" &&
        <div id="nova-entrada" style={styles.root}>
            <Title
                title="NOVA ENTRADA"
            />
           <div className="my-5 animated slideInLeft d-flex">
                {showMainContent()}
               <SideButton
                    onClick={() => setCurrComponent("FinanceGraph")}
                />
           </div>
        </div>
    );
}