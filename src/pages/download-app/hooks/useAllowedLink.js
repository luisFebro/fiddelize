import { useEffect, useState } from "react";
import getAPI, { isLinkAllowed } from "api";

// when there is a link with PTS, check if the same link is still in the allowedLinks from admin
export default function useAllowedLink({
    bizId,
    isCliUser,
    whichRole,
    encryptedPTS,
    linkCode,
}) {
    const [status, setStatus] = useState(true);

    useEffect(() => {
        const isCliUserLinkPTS = isCliUser && encryptedPTS;
        if (!isCliUserLinkPTS || whichRole !== "cliente") return true;

        (async () => {
            const isAllowed = await getAPI({
                url: isLinkAllowed(),
                params: {
                    linkCode,
                    bizId,
                },
            });

            if (!isAllowed) setStatus(false);
        })();

        return true;
    }, [linkCode, bizId, isCliUser, whichRole, encryptedPTS]);

    return status;
}
