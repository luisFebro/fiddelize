import { convertDotToComma } from "../../utils/numbers/convertDotComma";

const AllScores = ({
    currScoreRef,
    currScore,
    userId,
    showPercentage,
    lastScore,
    needAppForPreview,
    selectTxtStyle,
    colorBack,
    // colorS,
    totalGeneralScore,
    totalPurchasePrize,
    userName,
}) => {
    lastScore = convertDotToComma(lastScore);
    const selectedTxtStyle = selectTxtStyle(colorBack, { bold: true });

    return (
        <section className="text-subtitle my-3 text-white text-center">
            <span className={`text-title ${selectedTxtStyle}`}>Seu Saldo:</span>
            <br />
            <div className="d-flex justify-content-center">
                <p
                    className={`text-hero ${selectedTxtStyle}`}
                    ref={currScoreRef}
                >
                    ...
                </p>
                <span className={`ml-2 ${selectedTxtStyle}`}>Pontos</span>
            </div>
            {/* LAST SCORE */}
            {currScore === 0 || !currScore || !showPercentage ? null : (
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
                        <span className="text-em-1-3">{lastScore} pts</span>
                    </div>
                </section>
            )}
        </section>
    );
};

export default AllScores;
