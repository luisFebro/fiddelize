import { useEffect, useState, useRef } from "react";
import generateAppDownloadLink from "../../../../../../utils/biz/generateAppDownloadLink";
import getFirstName from "../../../../../../utils/string/getFirstName";

export default function useInvitationMsg({
    name,
    linkScore,
    isNewMember,
    bizName,
    verifPass,
    payload,
    bizCodeName,
    linkId,
    trigger,
}) {
    const [msg, setMsg] = useState("");

    const downloadLink = useRef(null);

    useEffect(() => {
        if (linkId === "..." || !trigger) return;

        downloadLink.current = generateAppDownloadLink({
            bizCodeName,
            name,
            payload,
            linkScore,
            linkId,
        });

        const handleTxt = () => {
            if (isNewMember) {
                return `Segue o app do clube de fidelidade para membros da ${
                    bizName && bizName.toUpperCase()
                }. Acesse: ${downloadLink.current} | Senha: ${verifPass}`;
            }
            return `${getFirstName(
                name.toUpperCase()
            )}, segue convite para o clube de fidelidade da ${
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
