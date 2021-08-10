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
    allUsersLength,
    mainSubject = "cliente",
    // loading,
    countCliUsersCurrPoints,
    countCliUsersGeneralPoints,
}) {
    const styles = getStyles();

    allUsersLength = Number(allUsersLength);
    // const activePTS = convertToReal(countCliUsersCurrPoints);
    // const usedPTS = convertToReal(countCliUsersGeneralPoints - countCliUsersCurrPoints);
    const generalPTS = convertToReal(countCliUsersGeneralPoints);

    const showGeneralScores = () => (
        <p
            className="text-subtitle font-weight-bold text-center mt-2 py-2 px-3 font-weight-bold"
            style={styles.accumulativeScore}
        >
            {`${generalPTS} Pontos Gerais`}
        </p>
    );

    const showCredits = () => <ProCreditsBadge service="Novvos Clientes" />;

    if (generalPTS === undefined) {
        return (
            <div className="mb-5 animated fadeInUp ml-3 position-relative">
                <span className="text-subtitle font-weight-bold">
                    Totais Gerais:
                </span>
                <br />
                <span className="text-center text-normal text-grey font-weight-bold">
                    Indisponível
                </span>
            </div>
        );
    }

    return (
        <section>
            <h2 className="text-purple">
                {allUsersLength === "0" ? (
                    ""
                ) : (
                    <div className="mb-5 animated fadeInUp ml-3 position-relative">
                        <span className="text-subtitle font-weight-bold">
                            {period === "all"
                                ? "Totais Gerais:"
                                : "Totais Gerais:"}{" "}
                            {/* Totais no Período */}
                        </span>
                        <br />
                        <span className="mr-2 text-normal font-weight-bold">
                            •{" "}
                            {`${allUsersLength} ${mainSubject}${
                                allUsersLength > 1 ? "s" : ""
                            }`}
                        </span>
                        <br />
                        {showGeneralScores()}
                        {showCredits()}
                    </div>
                )}
            </h2>
        </section>
    );
}

/* ARCHIVES
const showActiveScores = () => (
        <div className="m-0">
            <p className="text-normal font-weight-bold m-0 mr-2">
                •{" "}
                {`${usedPTS} Pontos Descontados`}
            </p>
        </div>
    );

const textInstru =
    "É o total geral de saldo em pontos disponível para o uso pelos clientes";

<p className="d-inline-block text-normal font-weight-bold m-0 mr-2">
    • {`${activePTS} Pontos Ativos`}
</p>
<div className="d-inline-block">
    <InstructionBtn text={textInstru} mode="tooltip" />
</div>

 */

// <SearchResult
//     isLoading={loading}
//     filteredUsersLength={totalSize}
//     countCliUsersGeneralPoints={countCliUsersGeneralPoints}
//     countCliUsersCurrPoints={countCliUsersCurrPoints}
//     allUsersLength={totalSize}
//     searchTerm={searchTerm}
//     mainSubject="cliente"
// />
