import { useEffect, useState, useRef } from "react";
import generateAppDownloadLink from "utils/biz/generateAppDownloadLink";
import getFirstName from "utils/string/getFirstName";

export default function useInvitationMsg({
    name,
    linkScore,
    isNewMember,
    bizName,
    payload,
    bizLinkName,
    linkId,
    trigger,
}) {
    const [msg, setMsg] = useState("");

    const downloadLink = useRef(null);

    useEffect(() => {
        if (linkId === "..." || !trigger) return;

        downloadLink.current = generateAppDownloadLink({
            bizLinkName,
            name,
            payload,
            linkScore,
            linkId,
        });

        const handleTxt = () => {
            if (isNewMember) {
                return `Segue o app do clube de compras para membros da ${
                    bizName && bizName.toUpperCase()
                }. Acesse: ${downloadLink.current}`;
            }
            return `${getFirstName(
                name.toUpperCase()
            )}, segue convite para o clube de compras da ${
                bizName && bizName.toUpperCase()
            }. Acesse: ${downloadLink.current}`;
        };

        if (name) {
            const text = handleTxt();
            setMsg(text);
        }
    }, [name, linkScore, linkId]);

    return { msg, downloadLink: downloadLink.current };
}
