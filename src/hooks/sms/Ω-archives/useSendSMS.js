import { useEffect } from "react";
import sendSMS from "./sendSMS";
// Check why sometimes this is being trigger many times...
export default function useSendSMS({
    trigger,
    serviceType = "confirmedChall",
    contactList,
    userId,
    smsId,
    customMsg,
    isAutomatic = true,
    dispatch,
}) {
    useEffect(() => {
        if (trigger) {
            sendSMS({
                serviceType,
                userId,
                smsId,
                customMsg,
                contactList,
                isAutomatic,
                dispatch,
                trigger,
            });
        }
    }, [trigger]);

    // return done;
}
