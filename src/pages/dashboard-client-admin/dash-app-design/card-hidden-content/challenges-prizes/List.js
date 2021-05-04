import { useState, useEffect } from "react";
import { useStoreDispatch } from "easy-peasy";
import ChallComp from "./ChallComp";
import { useBizData } from "init";
import {
    readClientAdmin,
    updateUser,
} from "../../../../../redux/actions/userActions";
import showToast from "../../../../../components/toasts";
import ShowBizNotes from "./ShowBizNotes";

export default function List({ setMode, mode, needAdd, setHideAddBtn }) {
    const {
        bizId,
        milestoneIcon,
        mainReward,
        targetPoints,
        rewardList,
        bizPlan,
    } = useBizData();

    // jsut in case user by any change does not pass throu self-service and decide to log in withot data recorded...
    const firstMainData = {
        id: bizId,
        icon: milestoneIcon,
        targetPoints: targetPoints,
        rewardDesc: mainReward,
    };
    if (!rewardList.length) {
        rewardList.unshift(firstMainData);
    }

    const [challengesArray, setChallengesArray] = useState(rewardList);
    const [isConstantMode, setIsConstantMode] = useState(
        challengesArray.length < 2
    );
    const [needUpdateData, setNeedUpdateData] = useState(false);
    const [switchAddBtn, setSwitchAddBtn] = useState(false);

    const dispatch = useStoreDispatch();

    const limitFree = bizPlan === "gratis" && challengesArray.length >= 3;
    useEffect(() => {
        if (limitFree) {
            setHideAddBtn(true);
        } else {
            setHideAddBtn(false);
        }
    }, [limitFree, switchAddBtn]);

    useEffect(() => {
        // needAdd is a unique id every time add button is clicked.
        if (needAdd) {
            setIsConstantMode(false);
            updateThisUser(false, { addThisId: true });
        }
    }, [needAdd]);

    const updateThisUser = (needMsg = true, opts = {}) => {
        const { deleteThisId, addThisId } = opts;
        const constObj = {
            "clientAdminData.milestoneIcon": challengesArray[0].icon,
            "clientAdminData.targetPoints": challengesArray[0].targetPoints,
            "clientAdminData.mainReward": challengesArray[0].rewardDesc,
        };

        let newModifiedArray;
        if (deleteThisId) {
            newModifiedArray = challengesArray.filter(
                ({ id }) => id !== deleteThisId
            );
            if (newModifiedArray.length === 1) {
                setIsConstantMode(true);
            }
            if (limitFree) {
                setSwitchAddBtn(true);
            }
            setChallengesArray(newModifiedArray);
        }
        if (addThisId) {
            let lasttargetPoints =
                challengesArray[challengesArray.length - 1].targetPoints;
            const lastIcon = challengesArray[challengesArray.length - 1].icon;
            const addedObj = {
                id: needAdd,
                icon: lastIcon,
                targetPoints: ++lasttargetPoints,
                rewardDesc: "Sem Descrição",
            };
            newModifiedArray = [...challengesArray, addedObj];
            setChallengesArray(newModifiedArray);
        }

        const dataToSend = {
            ...constObj,
            "clientAdminData.rewardList": newModifiedArray || challengesArray,
        };

        updateUser(dispatch, dataToSend, bizId, {
            thisRole: "cliente-admin",
        }).then((res) => {
            if (res.status !== 200)
                return showToast("Algo deu errado. Verifique sua conexão.", {
                    type: "error",
                });
            readClientAdmin(dispatch, bizId).then((res) => {
                if (res.status !== 200)
                    return showToast(res.data.msg, { type: "error" });
                needMsg && showToast("Alterações salvas!", { type: "success" });
            });
        });
    };

    useEffect(() => {
        if (needUpdateData) {
            updateThisUser();
        }
    }, [needUpdateData]);

    useEffect(() => {
        isConstantMode ? setMode("Constante") : setMode("Progressivo");
    }, [isConstantMode]);

    const txtStyle = "text-normal text-left font-weight-bold";

    return (
        <div className="mt-5">
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
                        icon={chall.icon}
                        targetPoints={chall.targetPoints}
                        rewardDesc={chall.rewardDesc}
                        milestoneIcon={milestoneIcon}
                        updateThisUser={updateThisUser}
                    />
                </div>
            ))}
            {!isConstantMode && <ShowBizNotes limitFree={limitFree} />}
        </div>
    );
}
