import React, { useEffect, useState } from "react";
import getAPI, { sendEmail } from "../../utils/promises/getAPI";

export default function useSendEmail({
    trigger = true,
    toEmail,
    type = "payAlert",
    priority = "mailer",
    payload = {},
}) {
    const [alreadySent, setAlreadySent] = useState(false);

    const body = {
        type,
        priority,
        payload,
    };

    useEffect(() => {
        if (trigger && !alreadySent) {
            (async () => {
                const emailSucc = await getAPI({
                    method: "post",
                    url: sendEmail(),
                    body,
                });
                setAlreadySent(true);
                if (emailSucc) console.log("invest email ok");
            })();
        }
    }, [trigger, body, alreadySent]);
}
