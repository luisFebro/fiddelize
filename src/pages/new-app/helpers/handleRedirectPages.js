import { useEffect } from "react";
import { getVar, getMultiVar, store } from "../../../hooks/storage/useVar";

export const useNeedRedirectPage = ({ history, priorPageId }) => {
    if (!history || !priorPageId)
        throw new Error("history and priorPage is required!");

    useEffect(() => {
        (async () => {
            const gotPriorPage = await getVar(priorPageId, store.pre_register);
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
    ] = await getMultiVar(
        [
            "clientAdminData",
            "doneBizInfo",
            "doneRewardPlanner",
            "doneSSRatingIcon",
        ],
        store.pre_register
    );

    if (!clientAdminData) return "/novo-app/info-negocio";

    const bizName = clientAdminData.bizName;
    const bizCodeName = clientAdminData.bizCodeName;
    const mainReward = clientAdminData.mainReward;
    const rewardScore = clientAdminData.rewardScore;

    if (doneSSRatingIcon) return `/${bizCodeName}/novo-app/cadastro-admin`;
    if (doneRewardPlanner)
        return `/${bizCodeName}/novo-app/self-service?negocio=${bizName}&ponto-premio=${rewardScore}&premio-desc=${mainReward}&nome-cliente=Ana`;
    if (doneBizInfo) return `/${bizCodeName}/novo-app/metas`;
};
