import React, { useEffect, useState } from "react";
import useAPI, { isLinkAllowed } from "../../../hooks/api/useAPI";
import useGetVar from "../../../hooks/storage/useVar";

export default function useAllowedLink({
    bizId,
    isCliUser,
    isCliAdmin,
    userScore,
}) {
    const { data: linkCode } = useGetVar("linkCode", { storeName: "user" });

    const blackList =
        linkCode &&
        (linkCode.includes("nucleo") || linkCode.includes("equipe"));

    const { data: isAllowed, loading } = useAPI({
        url: isLinkAllowed(),
        params: {
            linkCode,
            bizId,
        },
        trigger: linkCode && !blackList,
    });

    if (loading) return true;
    const userCond = isCliUser && userScore;
    const adminCond = isCliAdmin;
    if (!userCond || adminCond) return true;

    return isAllowed;
}
