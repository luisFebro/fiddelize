// LESSON: use import * as React from "react" in case the component is not being recognized or is being delayed to appear when in async mode. Also check the comp, try build the component properly with right props and structure
import { formatDMY, fromNow } from "utils/dates/dateFns";
import Card from "@material-ui/core/Card";
import { useState, Fragment } from "react";
import useData, { useBizData } from "init";
import useAPIList, { readBuyHistory } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import convertToReal from "utils/numbers/convertToReal";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import PickOtherCards from "./PickOtherCards";

export default function CardsList({
    cliUserId,
    cliUserFirstName,
    isFromDashboard,
    totalGeneralPoints,
}) {
    const { firstName } = useData();
    const [skip, setSkip] = useState(0);

    const gotUserPoints = Boolean(totalGeneralPoints);
    const { role, adminGame } = useData();
    const isAdmin = role === "cliente-admin";

    const { targetPoints } = adminGame.targetPrize;
    const { themeBackColor, themePColor } = useBizData();

    const txtClass = selectTxtStyle(themeBackColor);

    const params = {
        targetPoints,
        isFromDashboard,
    };

    const {
        list,
        hasMore,
        readyShowElems,
        isOffList,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        // content,
    } = useAPIList({
        url: readBuyHistory(cliUserId),
        params,
        skip,
        listName: "buyPointCardsList",
    });

    const detectedCard = useElemDetection({ loading, hasMore, setSkip });

    const showAllPointsBadge = () => {
        const allPoints = convertToReal(totalGeneralPoints);

        return (
            <section className="all-points animated fadeInUp delay-3s container-center mb-5">
                <p
                    className={`${txtClass} text-pill text-normal d-inline-block font-weight-bold m-0 ml-2`}
                >
                    {allPoints} pontos gerais
                    <span className="d-inline-block ml-2">
                        <GroupWorkIcon
                            style={{ fontSize: 30, transform: "rotate(40deg)" }}
                        />
                    </span>
                </p>
                <style jsx>
                    {`
                        .all-points p {
                            background: var(--themePDark--${themePColor});
                        }
                    `}
                </style>
                <style jsx>
                    {`
                        .all-points p {
                            color: rgb(255, 255, 0);
                            padding: 10px 15px;
                        }
                    `}
                </style>
            </section>
        );
    };

    const showOfflineStatus = () =>
        isOffList && (
            <div className="text-center my-3 text-normal font-weight-bold text-purple">
                <span style={{ fontSize: "25px" }}>
                    ✔ Últimos Registros Offline
                </span>
            </div>
        );

    function Header() {
        return (
            <Fragment>
                <section className="record-card desc position-absolute">
                    <p className="font-site text-em-1-1 text-black font-weight-bold">
                        Descrição
                    </p>
                </section>
                <section className="record-card score position-absolute">
                    <p className="font-site text-em-1-1 text-black font-weight-bold">
                        Pontos
                    </p>
                </section>
                <style jsx>
                    {`
                        .record-card {
                            top: -20px;
                            z-index: 1000;
                        }

                        .record-card p {
                            background-color: var(--lightGrey);
                            padding: 3px 5px;
                            border-radius: 25px;
                        }

                        .record-card.desc {
                            left: 30px;
                        }

                        .record-card.score {
                            right: 30px;
                        }
                    `}
                </style>
            </Fragment>
        );
    }

    function RecordCard({ historyData }) {
        const { desc, isLastRecordCard, createdAt } = historyData;

        const showDesc = () => (
            <section className="desc text-left">
                <div className="inner-container">
                    <span className="d-inline-block mt-1 font-weight-bold text-normal">
                        {desc}
                    </span>
                    <div className="timestamp mt-1 text-small font-weight-bold">
                        {formatDMY(createdAt)}
                        <br />
                        {fromNow(createdAt)}
                    </div>
                    <style jsx>
                        {`
                            .timestamp {
                                line-height: 18px;
                            }
                        `}
                    </style>
                </div>
            </section>
        );

        const showScore = () => (
            <div className="card-score font-weight-bold text-subtitle text-center">
                {convertToReal(historyData.value)}
                <span className="d-inline-block text-small font-weight-bold ml-1">
                    pts
                </span>
                <style jsx>
                    {`
                        .card-score {
                            color: rgb(255, 255, 0);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    `}
                </style>
            </div>
        );

        return (
            <section className="position-relative">
                <Card className="record-card--root mt-2">
                    <section className="record-card-body text-white font-weight-bold text-normal text-center text-purple">
                        {showDesc()}
                        {showScore()}
                    </section>
                </Card>
                {isLastRecordCard && <Header />}
                <style jsx global>
                    {`
                        .record-card-body {
                            display: flex;
                            padding: 0 4px;
                            background: var(--mainDark);
                        }

                        .record-card-body div {
                            padding: 9px 5px;
                        }

                        .desc {
                            flex-basis: 70%;
                        }
                    `}
                </style>
            </section>
        );
    }

    const pickCard = (historyData) => {
        const { cardType, gameType = "fsdfs" } = historyData;
        const isRecord = cardType === "record";

        return (
            <Fragment>
                {!isRecord && (
                    <Fragment>
                        {gameType && <hr className="lazer-purple my-4" />}
                        <PickOtherCards
                            historyData={historyData}
                            colorP={themePColor}
                        />
                    </Fragment>
                )}
                {isRecord && <RecordCard historyData={historyData} />}
            </Fragment>
        );
    };

    const mainData =
        !isOffList &&
        list.map((historyData, ind) =>
            checkDetectedElem({ list, ind, indFromLast: 3 }) ? (
                <div key={historyData._id} ref={detectedCard}>
                    {pickCard(historyData)}
                </div>
            ) : (
                <div key={historyData._id}>{pickCard(historyData)}</div>
            )
        );

    const showOverMsg = () => (
        <Fragment>
            {!hasMore && readyShowElems && (
                <p className="my-5 text-normal text-center font-weight-bold text-purple">
                    Isso é tudo{!isAdmin ? `, ${cliUserFirstName}` : "."}
                </p>
            )}

            {isOffList && (
                <p className="my-5 text-normal text-center font-weight-bold text-purple">
                    Isso é tudo armazenado offline.
                </p>
            )}
        </Fragment>
    );

    const showUserCards = () => (
        <Fragment>
            {showAllPointsBadge()}
            {showOfflineStatus()}
            {mainData}
            {loading && <ShowLoadingSkeleton size="large" />}
            {error && <ShowError />}
            {showOverMsg()}
        </Fragment>
    );

    return (
        <section>
            {!gotUserPoints
                ? showNoBuyIllustration(firstName)
                : showUserCards()}
        </section>
    );
}

function showNoBuyIllustration(firstName) {
    return (
        <div className="container-center">
            <p
                className="position-relative text-subtitle font-weight-bold text-purple"
                style={{
                    fontSize: "2rem",
                    lineHeight: "35px",
                    textAlign: "center",
                    top: "70px",
                }}
            >
                Sem compras,
                <br />
                {firstName}
            </p>
            <img
                width={400}
                height={400}
                src="/img/illustrations/empty-woman-card.svg"
                alt="sem compras"
            />
        </div>
    );
}

/* ORIGINAL BODY

<div>
    {!gotUserPoints ? (
        illustrationIfEmpty()
    ) : (
        <Fragment>
            {!userCardsReady ? (
                <Spinner marginY={100} size="small" />
            ) : (
                <Fragment>
                    {showChallDelayAlert()}
                    {showAllTimeTotal()}
                    {showOfflineStatus()}
                    {mainData}
                    {loading && <ShowLoadingSkeleton size="large" />}
                    {error && <ShowError />}
                    {showOverMsg()}
                </Fragment>
            )}
        </Fragment>
    )}
</div>

 */
