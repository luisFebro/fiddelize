import React, { useEffect } from "react";
import createInstantAccount from "./helpers/createInstantAccount";
import getFilterDate from "../../../utils/dates/getFilterDate";
import generateBizCodeName from "./helpers/generateBizCodeName";
import { getVar, store } from "../../../hooks/storage/useVar";

const filter = getFilterDate();
// IMPORTANT: check how the url from both cliMember and cliUser for how does the job works on both...
export default function InstantAccount({ trigger = false, payload }) {
    const {
        bizId,
        bizName,
        primaryAgent,
        memberJob,
        memberId,
        userScore,
        isCliAdmin,
        isCliUser,
    } = payload;

    let body = {
        ...payload,
        filter,
        clientAdminData: {
            bizName,
            bizCodeName: isCliAdmin && generateBizCodeName(bizName),
            bizWhatsapp: "",
        }, // bizWhatsapp is assigned in the backend after finding CPF with profile data.
        bizTeamData: { job: "afiliado", primaryAgent },
        clientMemberData: { job: memberJob, bizId },
        clientUserData: { bizId, filterBirthday: "" },
        // ONLY CLI-USER verify these data
        register: isCliUser && {
            id: memberId || bizId,
            job: memberJob || "admin",
        },
        tempScore: userScore, // for member tasks newClient Record
        memberRole: !isCliUser
            ? undefined
            : memberJob
            ? "cliente-membro"
            : "cliente-admin", // for member tasks newClient Record
        linkCode: "", // e.g alan_yvs493z0 or pedro_nucleo:fiddelize, etc // this is fetched from url param to check if it is authorized.
    };
    console.log("body", body);

    useEffect(() => {
        if (trigger) {
            (async () => {
                if (isCliUser) {
                    const thisLinkCode = await getVar("linkCode", store.user);
                    body = { ...body, linkCode: thisLinkCode };
                    console.log("body", body);
                }
                // await createInstantAccount({ body })
            })();
        }
    }, [trigger, body]);

    return <div>Procure pelo seu CPF</div>;
}
