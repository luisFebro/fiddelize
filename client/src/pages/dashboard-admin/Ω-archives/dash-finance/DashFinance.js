import React, { useState } from 'react';
import DashSectionTitle from '../../DashSectionTitle';
import FinanceContentHandler from './finance-content-handler/FinanceContentHandler';

export default function DashFinance() {
    const [dashData, setDashData] = useState({
        cashInSumAll: 0,
        cashOutSumAll: 0,
        pendingSum: 0,
        period: 'dayMonth',
    })

    return (
        <div>
            <DashSectionTitle title="Controle Financeiro" backgroundColor="linear-gradient(to right, #000000, #434343)" />
            <FinanceContentHandler setDashData={setDashData} dashData={dashData} />
        </div>
    );
}