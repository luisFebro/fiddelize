import React, { useState, useRef } from "react";
import { Load } from "../../../../../components/code-splitting/LoadableComp";
import { setRun } from "../../../../../hooks/useRunComp";
import { useStoreDispatch } from "easy-peasy";
import SuccessOp from "./SuccessOp";

const AsyncRegister = Load({
    loading: true,
    loader: () =>
        import(
            "../../../../../components/auth/Register" /* webpackChunkName: "cli-user-register-comp-lazy" */
        ),
});

const AsyncRegisterMember = Load({
    loading: true,
    loader: () =>
        import(
            "../../../../../components/auth/RegisterClientMember" /* webpackChunkName: "cli-member-register-comp-lazy" */
        ),
});

export default function CompleteRegister({ handleNewSendingEnv, isNewMember }) {
    const [hidePanel, setHidePanel] = useState(false);
    const payload = useRef({});

    const dispatch = useStoreDispatch();

    const togglePanel = () => {
        setHidePanel((prev) => !prev);
    };

    const handleSuccessfulRegister = (payL) => {
        togglePanel();
        payload.current = payL;
        setRun(dispatch, isNewMember ? "" : "RecordedClientsList");
    };

    const showNewCliRegister = () =>
        !hidePanel && (
            <section className="my-5">
                {isNewMember ? (
                    <AsyncRegisterMember
                        isStaff={true} // isStaff define if is from the dashboard or not
                        callback={handleSuccessfulRegister}
                    />
                ) : (
                    <AsyncRegister
                        isStaff={true}
                        callback={handleSuccessfulRegister}
                    />
                )}
            </section>
        );

    const handleNewInvitation = () => {
        const thisPayload = payload.current;
        togglePanel();
        handleNewSendingEnv(thisPayload);
    };

    const showSuccessOp = () => (
        <SuccessOp
            trigger={hidePanel}
            ctaFunc={handleNewInvitation}
            isNewMember={isNewMember}
        />
    );

    return (
        <section>
            {showNewCliRegister()}
            {showSuccessOp()}
        </section>
    );
}
