import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import moment from "moment";
import { convertDotToComma } from "../../../../utils/numbers/convertDotComma";
import LoadMoreItemsButton from "../../../../components/buttons/LoadMoreItemsButton";
import { getPeriodQuery } from "../../../../redux/actions/financeActions";
import CashExpansiblePanel from "./cash-expansible-panels/CashExpansiblePanel";
import CashPanelHiddenContent from "./cash-expansible-panels/CashPanelHiddenContent";

const isSmall = window.Helper.isSmallScreen();

CashInList.propTypes = {
    setCashInData: PropTypes.func,
    cashInData: PropTypes.object,
    isParentLoading: PropTypes.bool,
    loadingIndicator: PropTypes.node,
    queryData: PropTypes.object,
};

export default function CashInList({
    setRun,
    run,
    setCashInData,
    cashInData,
    queryData,
    isParentLoading,
    loadingIndicator,
}) {
    const { period, chosenDate } = queryData;

    const styles = {
        root: {
            margin: "15px auto",
            paddingBottom: "25px",
            width: `${isSmall ? "100%" : "90%"}`,
            maxWidth: "450px",
            height: "auto",
            borderRadius: "10px",
            backgroundColor: "#34495e", // wet alphabet dark
            color: "var(--mainWhite)",
        },
        panel: {
            margin: "15px auto",
            width: "85%",
            height: "100px",
            backgroundColor: "#2ecc71", // emerald green
        },
    };

    const showTitleAndSummary = () => (
        <section>
            <p className="pt-4 text-main-container text-center text-em-2-0">
                ENTRADA
            </p>
            <p className="py-3 px-3 text-main-container text-left">
                Total de Operações:{" "}
                <strong className="text-em-2">
                    {isParentLoading ? "..." : cashInData.totalSize}
                </strong>
                <br />
                Valor Total: {isSmall ? <br /> : null}
                <strong className="text-em-2">
                    {isParentLoading
                        ? "..."
                        : `R$ ${convertDotToComma(cashInData.sumAll)}`}
                </strong>
            </p>
        </section>
    );

    // Accordion Content
    const actions = cashInData.list.map((item) => ({
        _id: item._id,
        mainHeading: item.cashInValue,
        secondaryHeading: parse(
            `&#187; Realizado pelo ${item.agentRole.toUpperCase()}: <br /><strong>${item.agentName.cap()}<strong /><br />&#187; Atualizado ${moment(
                item.updatedAt
            ).fromNow()}  atrás.`
        ),
        itemData: item,
        hiddenContent: <CashPanelHiddenContent data={item} />,
    }));

    const showExpansionPanel = () => (
        <CashExpansiblePanel
            actions={actions}
            backgroundColor="var(--incomeGreen)"
            color="var(--mainWhite)"
            setRun={setRun}
            run={run}
        />
    );
    // End Accordion Content

    const showMoreItemsBtn = () => (
        <LoadMoreItemsButton
            url={`/api/finance/cash-ops/list/${period}?skip=${"SKIP"}${getPeriodQuery(
                period,
                chosenDate
            )}`}
            objPathes={{
                strList: "data.cashInOps.list",
                strChunkSize: "data.cashInOps.chunkSize",
                strTotalSize: "data.cashInOps.totalSize",
            }}
            setData={setCashInData}
            data={cashInData}
            button={{
                title: "Carregar mais Registros",
                loadingIndicator: "Carregando mais agora...",
                backgroundColor: "#2ecc71",
            }}
        />
    );

    return (
        <div style={styles.root}>
            {showTitleAndSummary()}
            {isParentLoading ? (
                loadingIndicator
            ) : (
                <React.Fragment>
                    {showExpansionPanel()}
                    {showMoreItemsBtn()}
                </React.Fragment>
            )}
        </div>
    );
}
