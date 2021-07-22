import { useState, useEffect } from "react";
import { useBizData } from "init";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import ChallComp from "./ChallComp";

export default function ChallengesList({ challList, loading }) {
    const { bizId } = useBizData();

    const [challengesArray, setChallengesArray] = useState([]); // challList
    const isConstantMode = challengesArray.length < 2;

    useEffect(() => {
        if (challList && challList.length) setChallengesArray(challList);
    }, [challList]);

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
            "clientAdminData.games.targetPrize.challList": newModifiedArray,
        };

        updateUser(bizId, "cliente-admin", dataToSend).then(() => {
            if (needMsg) showToast("Alterações salvas!", { type: "success" });
        });
    };

    useEffect(() => {
        if (needUpdateData) updateThisUser();

        // eslint-disable-next-line
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
