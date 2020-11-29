import React, { useEffect, useState } from "react";
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
}) {
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const downloadLink = generateAppDownloadLink({
            bizCodeName,
            name,
            payload,
            linkScore,
        });

        const handleTxt = () => {
            if (isNewMember) {
                return `Segue o app de fidelidade para membros da ${
                    bizName && bizName.toUpperCase()
                }. Acesse: ${downloadLink} | Senha: ${verifPass}`;
            } else {
                return `${getFirstName(
                    name.toUpperCase()
                )}, segue convite para o programa de fidelidade da ${
                    bizName && bizName.toUpperCase()
                }. Acesse: ${downloadLink}`;
            }
        };

        if (name) {
            const text = handleTxt();
            setMsg(text);
        }
    }, [name, linkScore]);

    return msg;
}
