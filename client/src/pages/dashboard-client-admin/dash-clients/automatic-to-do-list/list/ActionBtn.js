import React from 'react';
import SwitchBtn from '../../../../../components/buttons/material-ui/SwitchBtn';

export default function ActionBtn({
    type = "pendingDelivery",
    callback,
    defaultStatus = false, }) {
    if(type === "pendingDelivery") {
        return (
            <section className="action-btn-pending-delivery">
                <SwitchBtn
                    leftTitle="Não"
                    rightTitle="Sim"
                    callback={callback}
                    defaultStatus={defaultStatus}
                />
            </section>
        );
    }
}