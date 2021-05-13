import InstructionBtn from "../../../../../components/buttons/InstructionBtn";
import convertToReal from "../../../../../utils/numbers/convertToReal";
import ProCreditsBadge from "../../../../../components/pro/ProCreditsBadge";

const getStyles = () => ({
    accumulativeScore: {
        display: "table", // avoid to spread the padding through all window, instead limit to padding. table has the advantage of preserve the blocking settings such as padding, margin and alignment, differently from inline type.
        fontSize: "28px",
        backgroundColor: "var(--themeP)",
        color: "var(--mainWhite)",
        borderRadius: "35px",
        lineHeight: "35px",
    },
});

export default function Totals({
    period = "all",
    loading,
    allUsersLength,
    mainSubject = "cliente",
    countCliUsersCurrPoints,
    countCliUserGeneralPoints,
}) {
    const styles = getStyles();

    countCliUsersCurrPoints = convertToReal(countCliUsersCurrPoints);
    countCliUserGeneralPoints = convertToReal(countCliUserGeneralPoints);
    allUsersLength = convertToReal(allUsersLength);

    const textInstru =
        "É o total geral de saldo em pontos disponível para o uso pelos clientes";
    const showActiveScores = () => (
        <div className="m-0">
            <p className="d-inline-block text-normal font-weight-bold m-0 mr-2">
                • {`${countCliUsersCurrPoints} Pontos Ativos`}
            </p>
            <div className="d-inline-block">
                <InstructionBtn text={textInstru} mode="tooltip" />
            </div>
            <p className="text-normal font-weight-bold m-0 mr-2">
                •{" "}
                {`${
                    countCliUserGeneralPoints - countCliUsersCurrPoints
                } Pontos Usados`}
            </p>
        </div>
    );

    const showGeneralScores = () => (
        <p
            className="text-subtitle font-weight-bold text-center mt-2 py-2 px-3 font-weight-bold"
            style={styles.accumulativeScore}
        >
            {`${countCliUserGeneralPoints} Pontos Gerais`}
        </p>
    );

    const showCredits = () => <ProCreditsBadge service="Novvos Clientes" />;

    return (
        <section>
            <h2 className="text-purple">
                {allUsersLength === "0" ? (
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
                        <span className="mr-2 text-normal font-weight-bold">
                            •{" "}
                            {`${allUsersLength} ${mainSubject}${
                                allUsersLength > 1 ? "s" : ""
                            }`}
                        </span>
                        <br />
                        {showActiveScores()}
                        {showGeneralScores()}
                        {showCredits()}
                    </div>
                )}
            </h2>
        </section>
    );
}
// <SearchResult
//     isLoading={loading}
//     filteredUsersLength={totalSize}
//     countCliUserGeneralPoints={countCliUserGeneralPoints}
//     countCliUsersCurrPoints={countCliUsersCurrPoints}
//     allUsersLength={totalSize}
//     searchTerm={searchTerm}
//     mainSubject="cliente"
// />
