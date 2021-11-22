import { useState, useEffect } from "react";
import { useBizData } from "init";
import { updateUser } from "api/frequent";
import showToast from "components/toasts";
import ChallComp from "./ChallComp";
import AddNewChallBtn from "./add-new-chall/AddNewChallBtn";

export default function ChallengesList({ challList, loading, setOptionData }) {
    const { bizId } = useBizData();

    const [challengesArray, setChallengesArray] = useState([]);

    useEffect(() => {
        // !challengesArray.length is not presented here, then every time we update the list will overrided by the primary challList
        if (!challengesArray.length && challList && challList.length)
            setChallengesArray(challList);
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
            "clientAdminData.games.discountBack.challList":
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
                <AddNewChallBtn updateLocalList={updateLocalList} />
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
                    Sem nenhum desafio adicionado.
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
                        id={chall.id}
                        perc={chall.perc}
                        targetPoints={chall.targetPoints}
                        targetMoney={chall.targetMoney}
                        updateLocalList={updateLocalList}
                    />
                </div>
            ))}
            {showNewPrizeBtn()}
        </div>
    );
}
