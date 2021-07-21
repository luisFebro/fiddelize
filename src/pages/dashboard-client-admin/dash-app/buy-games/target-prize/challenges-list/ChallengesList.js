import { useState, useEffect } from "react";
import useData, { useBizData } from "init";
import { useReadUser, updateUser } from "api/frequent";
import showToast from "components/toasts";
import { useAction } from "global-data/ui";
import ChallComp from "./ChallComp";

export default function ChallengesList({ triggerList }) {
    const { bizId } = useBizData();
    const { userId } = useData();

    const uify = useAction();

    const { data, loading } = useReadUser(
        userId,
        "cliente-admin",
        "clientAdminData.games.targetPrize.challList",
        {
            trigger: triggerList || userId, // triggerList is an random id
        }
    );
    const [challengesArray, setChallengesArray] = useState([]); // challList
    const isConstantMode = challengesArray.length < 2;

    useEffect(() => {
        if (data)
            setChallengesArray(
                data.clientAdminData.games.targetPrize.challList
            );
    }, [data]);

    const [needUpdateData, setNeedUpdateData] = useState(false);
    // const [switchAddBtn, setSwitchAddBtn] = useState(false);

    const updateThisUser = (needMsg = true, opts = {}) => {
        const { deleteThisId } = opts;

        let newModifiedArray;
        if (deleteThisId) {
            newModifiedArray = challengesArray.filter(
                ({ id }) => id !== deleteThisId
            );

            setChallengesArray(newModifiedArray);
        }

        const dataToSend = {
            "clientAdminData.games.targetPrize.challList": challengesArray,
        };

        updateUser(bizId, "cliente-admin", dataToSend, { uify }).then(() => {
            if (needMsg) showToast("Alterações salvas!", { type: "success" });
        });
    };

    useEffect(() => {
        if (needUpdateData) updateThisUser();
    }, [needUpdateData]);

    const txtStyle = "text-normal text-left font-weight-bold";

    return (
        <div className="mt-5">
            {loading && (
                <p className="text-normal text-center text-purple my-5">
                    carregando...
                </p>
            )}
            {!loading && !challengesArray.length && (
                <p className="text-center text-grey text-normal font-weight-bold my-5">
                    Sem nenhum prêmio adicionado.
                </p>
            )}
            {challengesArray.map((chall, ind) => (
                <div key={chall.id} className="mt-3">
                    {isConstantMode ? (
                        <p className={txtStyle}>Para todos os desafios:</p>
                    ) : (
                        <p className={txtStyle}>Para Desafio n.º {ind + 1}:</p>
                    )}
                    <ChallComp
                        setNeedUpdateData={setNeedUpdateData}
                        isFirst={ind === 0}
                        currChallNumber={ind + 1}
                        challengesArray={challengesArray}
                        setChallengesArray={setChallengesArray}
                        showToast={showToast}
                        id={chall.id}
                        icon={chall.milestoneIcon}
                        targetPoints={chall.targetPoints}
                        prizeDesc={chall.prizeDesc}
                        updateThisUser={updateThisUser}
                    />
                </div>
            ))}
        </div>
    );
}
