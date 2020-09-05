import React from "react";
import pluralizeBr from "../../../../../utils/string/pluralizeBr";
import InstructionBtn from "../../../../../components/buttons/InstructionBtn";

const getStyles = () => ({
    accumulativeScore: {
        display: "table", // avoid to spread the padding through all window, instead limit to padding. table has the advantage of preserve the blocking settings such as padding, margin and alignment, differently from inline type.
        fontSize: "28px",
        backgroundColor: "var(--themeP)",
        color: "var(--mainWhite)",
        borderRadius: "35px",
        lineHeight: "25px",
    },
});

export default function Totals({
    period = "all",
    loading,
    allUsersLength,
    mainSubject = "cliente",
    totalActiveScores,
    totalCliUserScores,
}) {
    const styles = getStyles();

    const textInstru =
        "É o total de pontos de todos desafios não concluídos e que ainda não foram descontados e, desta forma, estão ativos.";
    const showActiveScores = () => (
        <div className="m-0 d-flex">
            <p className="text-normal font-weight-bold m-0 mr-2">
                • {`${loading ? "..." : totalActiveScores} Pontos Ativos`}
            </p>
            <div>
                <InstructionBtn text={textInstru} mode="tooltip" />
            </div>
        </div>
    );

    const showGeneralScores = () => (
        <p
            className="text-subtitle font-weight-bold text-center mt-2 py-2 px-3 font-weight-bold"
            style={styles.accumulativeScore}
        >
            {`${loading ? "..." : totalCliUserScores} Pontos Acumulados`}
        </p>
    );

    return (
        <section>
            <h2 className="text-purple">
                {allUsersLength === 0 ? (
                    ""
                ) : (
                    <div
                        className="animated fadeInUp ml-3 position-relative"
                        style={{ margin: "40px 0px 20px" }}
                    >
                        <span className="text-subtitle font-weight-bold">
                            {period === "all"
                                ? "Totais Gerais:"
                                : "Totais no Período:"}
                        </span>
                        <br />
                        <span className="text-normal font-weight-bold">
                            •{" "}
                            {`${loading ? "..." : allUsersLength} ${pluralizeBr(
                                mainSubject
                            )}`}
                        </span>
                        <br />
                        {showActiveScores()}
                        {showGeneralScores()}
                    </div>
                )}
            </h2>
        </section>
    );
}
// <SearchResult
//     isLoading={loading}
//     filteredUsersLength={totalSize}
//     totalCliUserScores={totalCliUserScores}
//     totalActiveScores={totalActiveScores}
//     allUsersLength={totalSize}
//     searchTerm={searchTerm}
//     mainSubject="cliente"
// />
