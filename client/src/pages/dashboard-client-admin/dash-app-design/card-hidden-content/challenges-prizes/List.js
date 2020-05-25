import React, { useState, useEffect } from 'react';
import ChallComp from './ChallComp';
import { useClientAdmin, useAppSystem } from '../../../../../hooks/useRoleData';
import { readClientAdmin, updateUser } from '../../../../../redux/actions/userActions';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../../redux/actions/snackbarActions';

export default function List({ setMode }) {
    const { businessId } = useAppSystem();
    const { selfMilestoneIcon, mainReward, maxScore, rewardList } = useClientAdmin();
    const firstMainData = { id: businessId, icon: selfMilestoneIcon, rewardScore: maxScore, rewardDesc: mainReward };
    if(firstMainData.id !== rewardList[0].id) { rewardList.unshift(firstMainData); }
    const [challengesArray, setChallengesArray] = useState(rewardList);

    const [isConstantMode, setIsConstantMode] = useState(challengesArray.length <= 1);
    const [needUpdateData, setNeedUpdateData] = useState(false);
    const dispatch = useStoreDispatch();

    const updateThisUser = () => {
        let dataToSend;
        const constObj = {
            "clientAdminData.selfMilestoneIcon": challengesArray[0].icon,
            "clientAdminData.rewardScore": challengesArray[0].rewardScore,
            "clientAdminData.mainReward": challengesArray[0].rewardDesc,
        }
        isConstantMode
        ? dataToSend = constObj
        : dataToSend = { ...constObj, "clientAdminData.rewardList": challengesArray }

        updateUser(dispatch, dataToSend, businessId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, "Algo deu errado. Verifique sua conexão.", 'error')
            showSnackbar(dispatch, "Alterações salvas!", 'success');
            readClientAdmin(dispatch, businessId);
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
                <div key={chall._id} className="mt-3">
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
                        challengesArray={challengesArray}
                        setChallengesArray={setChallengesArray}
                        showSnackbar={showSnackbar}
                        dispatch={dispatch}
                        id={chall.id}
                        icon={chall.icon}
                        rewardScore={chall.rewardScore}
                        rewardDesc={chall.rewardDesc}
                    />
                </div>
            ))}
            {!isConstantMode && (
                <p
                    className="text-small text-purple mt-3 animated rubberBand"
                    style={{animationIterationCount: 2}}
                >
                    * Se tiver clientes com pontuação ativa em um <strong>desafio, não é possível exclui-lo.</strong>
                     Porém você <strong>poderá ainda editá-lo</strong>.
                </p>
            )}
        </div>
    );
}