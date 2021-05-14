import { convertDotToComma } from "utils/numbers/convertDotComma";

const AllScores = ({
    currPointsRef,
    currPoints,
    showMoreComps,
    lastPoints,
    needAppForPreview,
    txtColor,
}) => {
    lastPoints = convertDotToComma(lastPoints);

    return (
        <section className="text-subtitle my-3 text-white text-center">
            <span className={`text-title ${txtColor}`}>Seu Saldo:</span>
            <br />
            <div className="d-flex justify-content-center">
                <p className={`text-hero ${txtColor}`} ref={currPointsRef}>
                    ...
                </p>
                {showMoreComps ? (
                    <span
                        className={`animated rubberBand delay-2s ml-2 ${txtColor}`}
                    >
                        <img
                            className="pts-coin"
                            width={50}
                            height={50}
                            src="/img/app-pts-coin.svg"
                            alt="moeda digital pts para benefícios"
                        />
                        <style jsx>
                            {`
                                .pts-coin {
                                    filter: drop-shadow(
                                        0.001em 0.001em 0.18em grey
                                    );
                                }
                            `}
                        </style>
                    </span>
                ) : (
                    <span className={`ml-2 ${txtColor}`}>Pontos</span>
                )}
            </div>
            {/* LAST SCORE */}
            {currPoints === 0 || !currPoints || !showMoreComps ? null : (
                <section className="text-normal position-relative animated fadeIn">
                    <section>
                        <div
                            className="all-scores--ellipse"
                            style={{
                                left: needAppForPreview ? "160px" : "200px",
                            }}
                        >
                            <div
                                className="body"
                                style={{ left: needAppForPreview && "160px" }}
                            />
                        </div>
                    </section>
                    <div
                        style={{
                            zIndex: 10,
                            lineHeight: "1.2em",
                            color: "var(--themeP)",
                            position: "absolute",
                            top: "-18px",
                            left: needAppForPreview ? "170px" : "210px",
                        }}
                        className="text-em-0-7 text-nowrap font-weight-bold"
                    >
                        Sua
                        <br />
                        última pontuação:
                        <br />
                        <span className="text-em-1-3">{lastPoints} pts</span>
                    </div>
                </section>
            )}
        </section>
    );
};

export default AllScores;
