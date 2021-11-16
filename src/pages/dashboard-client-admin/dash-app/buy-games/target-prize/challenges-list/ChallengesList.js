import { useState, useEffect } from "react";
import { useBizData } from "init";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import ChallComp from "./ChallComp";
import AddNewPrizeBtn from "../add-new-prize/AddNewPrizeBtn";

export default function ChallengesList({ challList, loading, setOptionData }) {
    const { bizId } = useBizData();

    const [challengesArray, setChallengesArray] = useState([]); // challList
    // const isConstantMode = challengesArray.length < 2;

    const gotSomePic = !challengesArray.length
        ? false
        : challengesArray.some((chall) => chall.prizeDesc);

    useEffect(() => {
        if (challList && challList.length) setChallengesArray(challList);
        if (challengesArray && challengesArray.length)
            setOptionData((prev) => ({ ...prev, updatedOnce: true }));
        // eslint-disable-next-line
    }, [challList, challengesArray]);

    const updateLocalList = (opts = {}) => {
        const {
            needMsg,
            deleteThisId,
            updatedData,
            updateOnlyLocalItem,
        } = opts;

        if (updateOnlyLocalItem)
            return setChallengesArray((priorList) => [
                ...priorList,
                updateOnlyLocalItem,
            ]);

        let newModifiedArray;
        if (deleteThisId) {
            newModifiedArray = challengesArray.filter(
                ({ id }) => id !== deleteThisId
            );

            setChallengesArray(newModifiedArray);
        }

        const dataToSend = {
            "clientAdminData.games.targetPrize.challList":
                updatedData || newModifiedArray,
        };

        return updateUser(bizId, "cliente-admin", dataToSend).then(() => {
            if (needMsg) showToast("Alterações salvas!", { type: "success" });
        });
    };

    const txtStyle = "text-normal text-left font-weight-bold";

    const showNewPrizeBtn = () => (
        <div className="container-center my-5">
            <section className="position-relative">
                <AddNewPrizeBtn updateLocalList={updateLocalList} />
            </section>
        </div>
    );

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
            <p className={txtStyle}>
                <span className="text-subtitle font-weight-bold">
                    {challengesArray.length} desafios
                </span>{" "}
                ativos:
            </p>
            {challengesArray.map((chall, ind) => (
                <div key={chall.id} className="mt-3">
                    {ind !== 0 && <p className="mb-3" />}
                    <p className={txtStyle}>tipo {ind + 1}:</p>
                    <ChallComp
                        currChallNumber={ind + 1}
                        challengesArray={challengesArray}
                        setChallengesArray={setChallengesArray}
                        showToast={showToast}
                        gotSomePic={gotSomePic}
                        id={chall.id}
                        icon={chall.milestoneIcon}
                        targetPoints={chall.targetPoints}
                        prizeDesc={chall.prizeDesc}
                        prizeImg={chall.prizeImg}
                        updateLocalList={updateLocalList}
                    />
                </div>
            ))}
            {showNewPrizeBtn()}
        </div>
    );
}
