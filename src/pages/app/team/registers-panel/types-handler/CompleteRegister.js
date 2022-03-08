import { useState, useRef } from "react";
import { setRun, useAction } from "global-data/ui";
import { Load } from "components/code-splitting/LoadableComp";
import SuccessOp from "./SuccessOp";

const AsyncEmailRegisterCliUser = Load({
    loading: true,
    loader: () =>
        import(
            "components/auth/EmailRegisterCliUser" /* webpackChunkName: "email-register-cli-user-comp-lazy" */
        ),
});

const AsyncEmailRegisterCliMember = Load({
    loading: true,
    loader: () =>
        import(
            "components/auth/EmailRegisterCliMember" /* webpackChunkName: "email-register-cli-member-comp-lazy" */
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
                    <AsyncEmailRegisterCliMember
                        isStaff // isStaff define if is from the dashboard or not
                        callback={handleSuccessfulRegister}
                    />
                ) : (
                    <AsyncEmailRegisterCliUser
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
