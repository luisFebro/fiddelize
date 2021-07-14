import { useState } from "react";
import useData, { useBizData } from "init";
import "./_BenefitsGalleryList.scss";
import useAPIList, { readPrizes } from "api/useAPIList";
import Tooltip from "components/tooltips/Tooltip";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import { fromNow, formatDMY } from "utils/dates/dateFns";
import { gameBrNameStore } from "components/biz/GamesBadge";
import Trophy from "./Trophy";

export default function BenefitsGalleryList({ targetId }) {
    // targetId is from admin's app - clients records lits
    const [skip, setSkip] = useState(0);

    const { userId } = useData();
    const thisUserId = targetId || userId;

    const { bizName } = useBizData();
    const {
        list = [],
        listTotal,
        loading,
        needEmptyIllustra,
        ShowLoading,
        error,
        ShowError,
        ShowOverMsg,
        isPlural,
        hasMore,
        isOffline,
    } = useAPIList({
        url: readPrizes(thisUserId),
        skip,
        listName: "BenefitsGalleryList",
        filterId: "id",
        trigger: true,
    });

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    const showCard = (data) => {
        const {
            gameType = "targetPrize",
            challN = 1,
            benefitDesc = "ticket de ingresso",
            targetPoints = 500,
            createdAt = new Date(),
            staffName,
        } = data;

        const TrophyCard = (
            <div className="zoom-slow-it">
                <Trophy data={data} />
            </div>
        );

        const tooltipTxt = `
            <p class="text-center">${
                gameBrNameStore[gameType] &&
                gameBrNameStore[gameType].toUpperCase()
            } - N.º ${challN}</p>
            • Meta Final:<br /><strong>${targetPoints} PTS</strong>
            <br />
            <br />
            • Descrição Benefício:<br /><strong>${benefitDesc}</strong>
            <br />
            <br />
            • Recebido em:<br /><strong>${formatDMY(createdAt)} - ${fromNow(
            createdAt
        )}</strong>
            <br />
            <br />
            • Entregue por:<br /><strong>${
                staffName && staffName.cap()
            }</strong>
        `;

        return (
            <Tooltip
                needArrow
                whiteSpace
                width={325}
                text={tooltipTxt}
                element={TrophyCard}
                backgroundColor="var(--themeSDark--black)"
            />
        );
    };

    const listMap = list.map((data, ind) =>
        checkDetectedElem({ list, ind, indFromLast: 2 }) ? (
            <section key={data.id} ref={detectedCard}>
                {showCard(data)}
            </section>
        ) : (
            <section key={data.id}>{showCard(data)}</section>
        )
    );
    // END INFINITY LOADING LIST

    const showTitle = () => (
        <section className="py-4">
            <h1 className="animated fadeIn text-subtitle font-weight-bold text-center">
                Galeria de Benefícios
            </h1>
            <h2
                className="text-normal text-center animated fadeIn delay-2s"
                style={{
                    lineHeight: "25px",
                }}
            >
                {listTotal
                    ? `Tudo que você já ganhou da ${bizName && bizName.cap()}`
                    : "Todos seus benefícios aparecem aqui"}
            </h2>
            {Boolean(listTotal) && (
                <p className="my-3 font-weight-bold text-subtitle text-center text-purple">
                    {listTotal} benefício{isPlural ? "s" : ""} recebido
                    {isPlural ? "s" : ""}
                </p>
            )}
        </section>
    );

    const showEmptyIllustration = () => (
        <section className="mx-3 my-5 container-center-col">
            <img
                width={300}
                src="/img/illustrations/empty-benefits.svg"
                alt="nenhum benefício"
            />
            <h2 className="mt-3 text-normal font-weight-bold text-grey">
                Nenhum benefício recebido.
            </h2>
        </section>
    );

    const showNote = () => (
        <div className="mx-3 text-purple text-normal font-weight-bold">
            Nota:
            <span className="d-block text-small font-weight-bold">
                Clique no troféu para mais detalhes.
            </span>
        </div>
    );

    return (
        <section className="text-purple">
            {showTitle()}
            <section className="prize-list--root">
                {listMap}
                {loading && <ShowLoading />}
                {needEmptyIllustra && showEmptyIllustration()}
                {error && <ShowError />}
            </section>
            {!needEmptyIllustra && showNote()}
            <ShowOverMsg />
            <div style={{ marginBottom: 250 }} />
        </section>
    );
}
