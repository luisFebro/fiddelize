import React, { useEffect, useState } from "react";
import useAPI, { isLinkAllowed } from "../../../hooks/api/useAPI";
import useGetVar from "../../../hooks/storage/useVar";

export default function useAllowedLink({ bizId, isCliUser, userScore }) {
    const { data: linkCode } = useGetVar("linkCode", { storeName: "user" });

    const { data: isAllowed, loading } = useAPI({
        url: isLinkAllowed(),
        params: {
            linkCode,
            bizId,
        },
        trigger: linkCode,
    });

    if (loading) return true;
    const userCond = isCliUser && userScore;
    if (!userCond) return true;

    return isAllowed;
}
