import React from 'react';
import { useClientAdmin } from '../../../../../../../hooks/useRoleData';
import Trophy from './Trophy';
import useAPI, { readPrizes } from '../../../../../../../hooks/api/useAPI';
import Tooltip from '../../../../../../../components/tooltips/Tooltip';
import { fromNow, formatDMY } from '../../../../../../../utils/dates/dateFns';

export default function PrizeList({ userId }) {
    const {
        data: list,
        loading, error,
        ShowLoading, ShowError,
    } = useAPI({ url: readPrizes(userId) })
    // const { rewardList, arePrizesVisible } = useClientAdmin();
    const rewardList = [{a: 'a'}, {a: 'a'}, {a: 'a'},]
    const arePrizesVisible = false;
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
        <div className="zoom-slow-it">
            <Trophy key={prizeId} data={data} />
        </div>

        const tooltipTxt = `
            <p class="text-center">DETALHES</p>
            • Meta Final:<br /><strong>${finalGoal} pontos</strong>
            <br />
            <br />
            • Descrição Prêmio:<br /><strong>${prizeDesc}</strong>
            <br />
            <br />
            • Conquistado em:<br /><strong>${formatDMY(createdAt)} - ${fromNow(createdAt)}</strong>`;

        return(
            <Tooltip
                needArrow
                whiteSpace
                width={325}
                text={tooltipTxt}
                element={TrophyCard}
                backgroundColor={"var(--themeSDark--black)"}
            />
        );
    })

    return (
        <section className="prize-list--root">
            {dataMap}
            {loading && <ShowLoading />}
            {error && <ShowError />}
        </section>
    );
}

PrizeList.whyDidYouRender = true;