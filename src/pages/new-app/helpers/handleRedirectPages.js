import { useEffect } from "react";
import { getVars } from "init/var";

export const useNeedRedirectPage = ({ history, priorPageId }) => {
    if (!history || !priorPageId)
        throw new Error("history and priorPage is required!");

    useEffect(() => {
        (async () => {
            const [gotPriorPage] = await getVars([priorPageId], "pre_register");
            if (!gotPriorPage) history.push("/");
        })();
    }, []);
};

export const getNewAppPage = async () => {
    const [
        clientAdminData,
        doneBizInfo,
        doneRewardPlanner,
        doneSSRatingIcon,
    ] = await getVars(
        [
            "clientAdminData",
            "doneBizInfo",
            "doneRewardPlanner",
            "doneSSRatingIcon",
        ],
        "pre_register"
    );

    if (!clientAdminData) return "/novo-app/info-negocio";

    const { bizName } = clientAdminData;
    const { bizLinkName } = clientAdminData;
    const { mainReward } = clientAdminData;
    const { rewardScore } = clientAdminData;

    if (doneSSRatingIcon) return `/${bizLinkName}/novo-app/cadastro-admin`;
    if (doneRewardPlanner)
        return `/${bizLinkName}/novo-app/self-service?negocio=${bizName}&ponto-premio=${rewardScore}&premio-desc=${mainReward}&nome-cliente=Ana`;
    if (doneBizInfo) return `/${bizLinkName}/novo-app/metas`;
};
