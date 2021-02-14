import { useEffect, useState } from "react";
import { sendNotification } from "../../redux/actions/notificationActions";
import useGetVar, { setVar } from "../storage/useVar";

export default function useSendNotif(recipientId, cardType, options = {}) {
    const [sent, setSent] = useState(false);
    const { storage, subtype, content, trigger, role, senderId } = options;
    const key = storage && storage.key;
    const value = storage && storage.value;

    const { data: notifVersion, loading: loadingVar } = useGetVar(key);

    const hasVersion = key && notifVersion;

    // removeVersion now is integrated in a useEffect in the Challenge's confirmation modal when user
    // check for the notification. Then the system remove the version allowing sending notifcation to clli-admin again..

    useEffect(() => {
        let cancel;

        if (trigger && !hasVersion && !loadingVar && !sent) {
            if (cancel) return;
            const options = {
                subtype,
                content,
                role,
                senderId,
            };
            sendNotification(recipientId, cardType, options).then((res) => {
                if (res.status !== 200)
                    return console.log("Something wrong with useCountNotif");
                setSent(true);
                if (key) setVar({ [key]: value });
            });
        }
        return () => {
            cancel = true;
        };
    }, [trigger, hasVersion, loadingVar, sent]);

    return sent;
}
