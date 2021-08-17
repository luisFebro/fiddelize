import useData from "init";
import useAPI, { isLinkAllowed } from "api/useAPI";

export default function useAllowedLink({
    bizId,
    isCliUser,
    isCliAdmin,
    userScore,
}) {
    const [linkCode] = useData(["linkCode"]);

    const userCond = isCliUser && userScore;
    if (!userCond || isCliAdmin) return true;

    const blackList =
        linkCode !== "..." &&
        linkCode &&
        (linkCode.includes("nucleo") || linkCode.includes("equipe"));

    const { data: isAllowed, loading } = useAPI({
        url: isLinkAllowed(),
        params: {
            linkCode,
            bizId,
        },
        trigger: linkCode !== "..." && !blackList,
    });

    if (loading) return true;

    return isAllowed;
}
