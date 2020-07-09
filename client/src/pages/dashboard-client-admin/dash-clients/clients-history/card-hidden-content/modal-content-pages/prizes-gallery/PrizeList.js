import React from 'react';
import { useClientAdmin } from '../../../../../../../hooks/useRoleData';
import Trophy from './Trophy';
import useAPI, { readPrizes } from '../../../../../../../hooks/api/useAPI';
import Tooltip from '../../../../../../../components/tooltips/Tooltip';
import { fromNow, formatDMY } from '../../../../../../../utils/dates/dateFns';

export default function PrizeList({ userId }) {
    const {
        data: list,
        ShowLoading,
        ShowError,
    } = useAPI({ url: readPrizes(userId) })
    // const { rewardList, arePrizesHidden } = useClientAdmin();
    const rewardList = [{a: 'a'}, {a: 'a'}, {a: 'a'},]
    const arePrizesHidden = false;
    const isProgressiveMode = rewardList.length > 1;

    const getData = (cliPrize) => {
        const { challengeN, isPrizeReceived, isPrizeConfirmed, icon, desc, value, createdAt, } = cliPrize;

        const data = {
            type: "custom",
            challN: challengeN,
            challIcon: icon,
            prizeDesc: desc,
            isConfirmed: isPrizeConfirmed,
            isDelivered: isPrizeReceived,
            finalGoal: value,
            createdAt,
        };

        return data;
    }

    const dataMap = list && list.map(prize => {
        const {
            _id: prizeId,
            createdAt,
            value: finalGoal,
            desc: prizeDesc
        } = prize;

        const data = getData(prize);

        const TrophyCard =
        <div className="zoom-it">
            <Trophy key={prizeId} data={data} />
        </div>

        return(
            <Tooltip
                needArrow
                text={`
                    • Meta Final: <strong>${finalGoal} pontos</strong>
                    <br />
                    • Descrição Prêmio: <strong>${prizeDesc}</strong>
                    <br />
                    • Data: <strong>${formatDMY(createdAt)} - ${fromNow(createdAt)}</strong>`}
                element={TrophyCard}
                backgroundColor={"var(--themeSDark--black)"}
            />
        );
    })

    return (
        <section className="prize-list--root">
            <ShowLoading />
            <ShowError />
            {dataMap}
        </section>
    );
}

PrizeList.whyDidYouRender = true;