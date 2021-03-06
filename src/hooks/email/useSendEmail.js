import { useEffect, useState } from "react";
import getAPI, { sendEmail } from "../../utils/promises/getAPI";

export default function useSendEmail({
    trigger = true,
    type = "payAlert",
    priority = "mailer",
    payload = {},
}) {
    const [alreadySent, setAlreadySent] = useState(false);

    useEffect(() => {
        if (alreadySent || !trigger) return;

        const body = {
            type,
            priority,
            payload,
        };

        const send = async () => {
            const emailSucc = await getAPI({
                method: "post",
                url: sendEmail(),
                body,
            });
            setAlreadySent(true);
            if (emailSucc) console.log("invest email ok");
        };

        if (!alreadySent) {
            send();
        }
        // eslint-disable-next-line
    }, [trigger, alreadySent]);
}
