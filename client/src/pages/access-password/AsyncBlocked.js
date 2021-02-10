import React, { useState, useEffect, useRef, Fragment } from "react";
import getCountdownTimer from "../../utils/numbers/getCountdownTimer";
import PasswordRecoverBtn from "./password-recover-modal/PasswordRecoverBtn";

export default function AsyncBlocked({ lockMin, textColor, setLock }) {
    const [isOver, setOver] = useState(false);

    const timerRef = useRef();
    useEffect(() => {
        if (timerRef) {
            getCountdownTimer({
                dur: lockMin,
                elem: timerRef.current,
                overCallback: setOver,
            });
        }

        return () =>
            timerRef &&
            // The ref value 'timerRef.current' will likely have changed by the time this effect cleanup function runs. If this ref points to a node rendered by React, copy 'timerRef.current' to a variable inside the effect, and use that variable in the cleanup function
            // eslint-disable-next-line
            getCountdownTimer({ stop: true, elem: timerRef.current });
    }, [timerRef, lockMin]); // LESSON: The ref value 'timerRef.current' will likely have changed by the time this effect cleanup function runs. If this ref points to a node rendered by React, copy 'timerRef.current' to a variable inside the effect, and use that variable in the cleanup function

    useEffect(() => {
        if (isOver) {
            setLock({
                lockMin: 0,
                isBlocked: false,
            });
        }
        // eslint-disable-next-line
    }, [isOver]);

    return (
        <Fragment>
            <p className={`${textColor} mx-3 text-center text-subtitle`}>
                Por segurança,
                <br />
                acesso bloqueado por:
            </p>
            <div
                className={`${textColor} mb-5 text-center text-hero`}
                ref={timerRef}
            >
                ...
            </div>
            <p
                className={`${textColor} mx-3 text-center text-normal position-fixed`}
                style={{ bottom: 15 }}
            >
                Por favor, aguarde para tentar de novo ou{" "}
                <PasswordRecoverBtn
                    textColor={textColor}
                    fromBlockedComp={true}
                />
            </p>
        </Fragment>
    );
}
