import { useState } from "react";
import Trophy from "./Trophy";
import useAPIList, { readPrizes } from "hooks/api/useAPIList";
import { useBizData } from "init";
import Tooltip from "components/tooltips/Tooltip";
import { fromNow, formatDMY } from "utils/dates/dateFns";

export default function PrizeList({ userId }) {
    const [skip, setSkip] = useState(0);

    const { bizId } = useBizData();
    const { list, loading, ShowLoading, error, ShowError } = useAPIList({
        url: readPrizes(userId),
        params: { cliAdminId: bizId },
    });

    const dataMap =
        list &&
        list.map((prize) => {
            const {
                type,
                _id: prizeId,
                createdAt,
                finalGoal,
                prizeDesc,
                challN,
            } = prize;

            const TrophyCard = (
                <div className={type === "custom" ? "zoom-slow-it" : ""}>
                    <Trophy data={prize} />
                </div>
            );

            const newDate = new Date();
            const tooltipTxt = `
            <p class="text-center">DETALHES - DESAFIO N.º ${challN}</p>
            • Meta Final:<br /><strong>${finalGoal} pontos</strong>
            <br />
            <br />
            • Descrição Prêmio:<br /><strong>${prizeDesc}</strong>
            <br />
            <br />
            • Conquistado em:<br /><strong>${formatDMY(
                createdAt || newDate
            )} - ${fromNow(createdAt || newDate)}</strong>`;

            return (
                <div key={prizeId}>
                    {type === "custom" ? (
                        <Tooltip
                            needArrow
                            whiteSpace
                            width={325}
                            text={tooltipTxt}
                            element={TrophyCard}
                            backgroundColor="var(--themeSDark--black)"
                        />
                    ) : (
                        TrophyCard
                    )}
                </div>
            );
        });

    return (
        <section className="prize-list--root">
            {dataMap}
            {loading && <ShowLoading />}
            {error && <ShowError />}
        </section>
    );
}

PrizeList.whyDidYouRender = true;
