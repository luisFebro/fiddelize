import React, { useState } from 'react';
import { Load } from '../../../../components/code-splitting/LoadableComp';
import { setRun } from '../../../../hooks/useRunComp';
import { useStoreDispatch } from 'easy-peasy';
import SuccessOp from './SuccessOp';

const AsyncRegister = Load({ loading: true, loader: () => import("../../../../components/auth/Register" /* webpackChunkName: "cli-user-register-comp-lazy" */) });

export default function CompleteRegister() {
    const [hidePanel, setHidePanel] = useState(false);

    const dispatch = useStoreDispatch();

    const togglePanel = () => {
        setHidePanel(prev => !prev);
    }

    const handleSuccessfulRegister = () => {
         togglePanel();
         setRun(dispatch, "RecordedClientsList");
    }

    const showNewCliRegister = () => (
        !hidePanel &&
        <section className="my-5">
            <AsyncRegister
                isStaff={true}
                callback={handleSuccessfulRegister}
            />
        </section>
    );

    const showSuccessOp = () => (
        <SuccessOp
            trigger={hidePanel}
            ctaFunc={togglePanel}
        />
    );

    return (
        <section>
           {showNewCliRegister()}
           {showSuccessOp()}
        </section>
    );
}