import { useState, useRef } from "react";
import { setRun, useAction } from "global-data/ui";
import SuccessOp from "./SuccessOp";
import { Load } from "../../../../../components/code-splitting/LoadableComp";

const AsyncRegister = Load({
    loading: true,
    loader: () =>
        import(
            "../../../../../components/auth/AsyncRegisterCliUser" /* webpackChunkName: "cli-user-register-comp-lazy" */
        ),
});

const AsyncRegisterMember = Load({
    loading: true,
    loader: () =>
        import(
            "../../../../../components/auth/AsyncRegisterCliMember" /* webpackChunkName: "cli-member-register-comp-lazy" */
        ),
});

export default function CompleteRegister({ handleNewSendingEnv, isNewMember }) {
    const [hidePanel, setHidePanel] = useState(false);
    const payload = useRef({});

    const uify = useAction();

    const togglePanel = () => {
        setHidePanel((prev) => !prev);
    };

    const handleSuccessfulRegister = (payL) => {
        // payL: { name, phone, email }
        togglePanel();
        payload.current = payL;
        setRun("runName", isNewMember ? "" : "RecordedClientsList", uify);
    };

    const showNewCliRegister = () =>
        !hidePanel && (
            <section className="my-5">
                {isNewMember ? (
                    <AsyncRegisterMember
                        isStaff // isStaff define if is from the dashboard or not
                        callback={handleSuccessfulRegister}
                    />
                ) : (
                    <AsyncRegister
                        isStaff
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
