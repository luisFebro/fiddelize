import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import moment from "moment";
import { convertDotToComma } from "../../../../utils/numbers/convertDotComma";
import LoadMoreItemsButton from "../../../../components/buttons/LoadMoreItemsButton";
import { getPeriodQuery } from "../../../../redux/actions/financeActions";
import CashExpansiblePanel from "./cash-expansible-panels/CashExpansiblePanel";
import CashPanelHiddenContent from "./cash-expansible-panels/CashPanelHiddenContent";

CashOutList.propTypes = {
    setCashInData: PropTypes.func,
    cashOutData: PropTypes.object,
    isParentLoading: PropTypes.bool,
    loadingIndicator: PropTypes.node,
    queryData: PropTypes.object,
};

const isSmall = window.Helper.isSmallScreen();

export default function CashOutList({
    setRun,
    run,
    setCashOutData,
    cashOutData,
    isParentLoading,
    loadingIndicator,
    queryData,
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
            backgroundColor: "#34495e",
            color: "var(--mainWhite)",
        },
        panel: {
            margin: "15px auto",
            width: "85%",
            height: "100px",
            backgroundColor: "#ff4757", // watermelon red
        },
    };

    const showTitleAndSummary = () => (
        <section>
            <p className="pt-4 text-main-container text-center text-em-2-0">
                SAÍDA
            </p>
            <p className="py-3 px-3 text-main-container text-left">
                Total de Operações:{" "}
                <strong className="text-em-2">
                    {isParentLoading ? "..." : cashOutData.totalSize}
                </strong>
                <br />
                Valor Total:{isSmall ? <br /> : null}
                <strong className="text-em-2">
                    {isParentLoading
                        ? "..."
                        : `R$ ${convertDotToComma(cashOutData.sumAll)}`}
                </strong>
            </p>
        </section>
    );

    // Accordion Content
    const actions = cashOutData.list.map((item) => ({
        _id: item._id,
        mainHeading: item.cashOutValue,
        secondaryHeading: parse(
            `&#187; Realizado por: <br /><strong>${item.agentName.cap()}<strong /><br />&#187; Atualizado ${moment(
                item.updatedAt
            ).fromNow()}  atrás.`
        ),
        itemData: item,
        hiddenContent: <CashPanelHiddenContent data={item} isCashOut />,
    }));

    const showExpansionPanel = () => (
        <CashExpansiblePanel
            actions={actions}
            isCashOut
            backgroundColor="var(--expenseRed)"
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
                strList: "data.cashOutOps.list",
                strChunkSize: "data.cashOutOps.chunkSize",
                strTotalSize: "data.cashOutOps.totalSize",
            }}
            setData={setCashOutData}
            data={cashOutData}
            button={{
                title: "Carregar mais Registros",
                loadingIndicator: "Carregando mais agora...",
                backgroundColor: "#ff4757",
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
