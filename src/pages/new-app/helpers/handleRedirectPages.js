import { useEffect } from "react";
import { getVars } from "init/var";

export const useNeedRedirectPage = ({ history, priorPageId }) => {
    if (!history || !priorPageId)
        throw new Error("history and priorPage is required!");

    useEffect(() => {
        (async () => {
            const [gotPriorPage, selectedGame] = await getVars(
                [priorPageId, "game"],
                "pre_register"
            );

            const isTargetGame = selectedGame === "targetPrize";
            if (!isTargetGame) {
                // the icon page is only for target game, so all other games should skip direct to admin register page here.
                const priorPageForOtherGames =
                    priorPageId === "doneSSRatingIcon"
                        ? "doneSSTheming"
                        : priorPageId;
                const [gotPriorPageForOtherGames] = await getVars(
                    [priorPageForOtherGames],
                    "pre_register"
                );
                if (!gotPriorPageForOtherGames) history.push("/");
                return;
            }

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

    if (!clientAdminData) return "/novo-clube/info-negocio";

    const { bizName } = clientAdminData;
    const { bizLinkName } = clientAdminData;
    const { prizeDesc } = clientAdminData;
    const { targetPoints } = clientAdminData;

    if (doneSSRatingIcon) return `/${bizLinkName}/novo-clube/cadastro-admin`;
    if (doneRewardPlanner)
        return `/${bizLinkName}/novo-clube/self-service?negocio=${bizName}&ponto-premio=${targetPoints}&premio-desc=${prizeDesc}&nome-cliente=Ana`;
    if (doneBizInfo) return `/${bizLinkName}/novo-clube/metas`;
};
