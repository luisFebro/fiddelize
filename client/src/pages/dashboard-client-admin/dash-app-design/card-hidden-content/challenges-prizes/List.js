import React, { useState, useEffect } from 'react';
import ChallComp from './ChallComp';
import { useClientAdmin, useAppSystem } from '../../../../../hooks/useRoleData';
import { readClientAdmin, updateUser } from '../../../../../redux/actions/userActions';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../redux/actions/snackbarActions';

export default function List({ setMode, mode, needAdd }) {
    const { businessId } = useAppSystem();
    const { selfMilestoneIcon, mainReward, maxScore, rewardList } = useClientAdmin();
    let firstMainData = { id: businessId, icon: selfMilestoneIcon, rewardScore: maxScore, rewardDesc: mainReward };
    if(!rewardList) { rewardList.unshift(firstMainData); }
    const [challengesArray, setChallengesArray] = useState(rewardList);
    const [isConstantMode, setIsConstantMode] = useState(challengesArray.length < 2);
    const [needUpdateData, setNeedUpdateData] = useState(false);
    const dispatch = useStoreDispatch();

    useEffect(() => {
        // needAdd is a unique id every time add button is clicked.
        if(needAdd) {
            setIsConstantMode(false);
            updateThisUser(false, {addThisId: true});
        }
    }, [needAdd])

    const updateThisUser = (needMsg = true, opts = {}) => {
        const { deleteThisId, addThisId } = opts;
        const constObj = {
            "clientAdminData.selfMilestoneIcon": challengesArray[0].icon,
            "clientAdminData.rewardScore": challengesArray[0].rewardScore,
            "clientAdminData.mainReward": challengesArray[0].rewardDesc,
        }

        let newModifiedArray;
        if(deleteThisId) {
            newModifiedArray = challengesArray.filter(({ id }) => id !== deleteThisId);
            if(newModifiedArray.length === 1) { setIsConstantMode(true); }
            setChallengesArray(newModifiedArray);
        }
        if(addThisId) {
            let lastRewardScore = challengesArray[challengesArray.length - 1].rewardScore;
            let lastIcon = challengesArray[challengesArray.length - 1].icon;
            const addedObj = { id: needAdd, icon: lastIcon, rewardScore: ++lastRewardScore, rewardDesc: 'Sem Descrição' }
            newModifiedArray = [...challengesArray, addedObj];
            setChallengesArray(newModifiedArray);
        }

        const dataToSend = { ...constObj, "clientAdminData.rewardList": newModifiedArray ? newModifiedArray : challengesArray }

        updateUser(dispatch, dataToSend, businessId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, "Algo deu errado. Verifique sua conexão.", 'error')
            readClientAdmin(dispatch, businessId)
            .then(res => {
                if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
                needMsg && showSnackbar(dispatch, "Alterações salvas!", 'success');
            })
        })
    }

    useEffect(() => {
        if(needUpdateData) { updateThisUser(); }
    }, [needUpdateData])

    useEffect(() => {
        isConstantMode
        ? setMode("Constante")
        : setMode("Progressivo")
    }, [isConstantMode])

    const txtStyle = "text-normal text-left font-weight-bold";

    return (
        <div className="mt-5">
            {challengesArray.map((chall, ind) => (
                <div key={chall.id} className="mt-3">
                    {isConstantMode ? (
                        <p className={txtStyle}>
                            Para todos os desafios:
                        </p>
                    ) : (
                        <p className={txtStyle}>
                            Para Desafio n.º {ind + 1}:
                        </p>
                    )}
                    <ChallComp
                        setNeedUpdateData={setNeedUpdateData}
                        isFirst={ind === 0}
                        currChallNumber={ind + 1}
                        challengesArray={challengesArray}
                        setChallengesArray={setChallengesArray}
                        showSnackbar={showSnackbar}
                        dispatch={dispatch}
                        id={chall.id}
                        icon={chall.icon}
                        rewardScore={chall.rewardScore}
                        rewardDesc={chall.rewardDesc}
                        milestoneIcon={selfMilestoneIcon}
                        updateThisUser={updateThisUser}
                    />
                </div>
            ))}
            {!isConstantMode && (
                <p
                    className="text-small text-purple mt-3 animated rubberBand"
                >
                    * Se tiver clientes com pontuação ativa em um <strong>desafio, não é possível exclui-lo. </strong>
                    Porém você <strong>poderá ainda editá-lo</strong>.
                </p>
            )}
        </div>
    );
}