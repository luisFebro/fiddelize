import React, { Fragment } from 'react';
import Trophy from './Trophy';
import useAPI, { readPrizes } from '../../../../../../../hooks/api/useAPI';
import { useAppSystem } from '../../../../../../../hooks/useRoleData';
import Tooltip from '../../../../../../../components/tooltips/Tooltip';
import { fromNow, formatDMY } from '../../../../../../../utils/dates/dateFns';

export default function PrizeList({ userId }) {
    const { businessId } = useAppSystem();
    const {
        data: list,
        loading, error,
        ShowLoading, ShowError,
    } = useAPI({ url: readPrizes(userId), params: { cliAdminId: businessId } })

    const dataMap = list && list.map(prize => {
        const {
            type,
            _id: prizeId,
            createdAt,
            finalGoal,
            prizeDesc
        } = prize;

        const TrophyCard =
        <div className={type === "custom" ? "zoom-slow-it" : ""}>
            <Trophy key={prizeId} data={prize} />
        </div>

        const newDate = new Date();
        const tooltipTxt = `
            <p class="text-center">DETALHES</p>
            • Meta Final:<br /><strong>${finalGoal} pontos</strong>
            <br />
            <br />
            • Descrição Prêmio:<br /><strong>${prizeDesc}</strong>
            <br />
            <br />
            • Conquistado em:<br /><strong>${formatDMY(createdAt || newDate)} - ${fromNow(createdAt || newDate)}</strong>`;

        return(
            <Fragment>
                {type === "custom"
                ? (
                    <Tooltip
                        needArrow
                        whiteSpace
                        width={325}
                        text={tooltipTxt}
                        element={null}
                        backgroundColor={"var(--themeSDark--black)"}
                    />
                ) : TrophyCard}
            </Fragment>
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