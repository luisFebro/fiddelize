import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PropTypes from "prop-types";

import "./RecordedClientsAccordion.scss";
import { useStoreDispatch, useStoreState } from "easy-peasy";
import ToggleBtn from "./ToggleBtn";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import RadiusBtn from "../../../../../components/buttons/RadiusBtn";
import {
    removeField,
    readUser,
} from "../../../../../redux/actions/userActions";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useClientAdmin, useAppSystem } from "../../../../../hooks/useRoleData";

import { setRun } from "../../../../../hooks/useRunComp";
import PrizesBtn from "../../../../mobile-app/history-purchase-btn/prizes-gallery/PrizesBtn";
// End Customized Data

const isSmall = window.Helper.isSmallScreen();

RegisteredClientsAccordion.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.object, // parser
            secondaryHeading: PropTypes.object, // parser
            hiddenContent: PropTypes.any,
        })
    ).isRequired,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    needToggleButton: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: isSmall ? "100%" : "80%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        padding: "15px 0",
        margin: isSmall ? "10px 0 40px" : "10px 80px 40px",
    },
}));

const getStyles = ({ color, backgroundColor }) => ({
    Accordion: {
        color,
        backgroundColor, // default is paper color
        margin: "25px 0 0",
    },
    totalPrizesBadge: {
        top: 0,
        right: -33,
        borderRadius: "50px",
        backgroundColor: "var(--niceUiYellow)",
        border: "3px solid grey",
        zIndex: 10,
    },
    trophyPrizes: {
        right: 55,
        bottom: 85,
    },
    prizesBtn: {
        bottom: -25,
        left: "50%",
        transform: "translateX(-50%)",
    },
});

export default function RegisteredClientsAccordion({
    actions,
    backgroundColor,
    color,
    needToggleButton = false,
    checkDetectedElem,
    detectedCard,
}) {
    const classes = useStyles();

    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();
    const { businessId } = useAppSystem();

    const { runArray } = useStoreState((state) => ({
        runArray: state.globalReducer.cases.runArray,
    }));

    const styles = getStyles({ color, backgroundColor });

    const handleEraseTestCard = (cardId) => {
        showSnackbar(dispatch, "Apagando card de teste...");
        setTimeout(() => {
            removeField(cardId, "clientUserData").then((res) => {
                showSnackbar(dispatch, "Atualizando app...", "warning", 5500);
                readUser(dispatch, businessId, { role: "cliente-admin" }).then(
                    (res) => {
                        if (res.status !== 200)
                            return showSnackbar(
                                dispatch,
                                "Não foi possível atualizar. Reinicie app.",
                                "error"
                            );
                        window.location.href = "/mobile-app?client-admin=1";
                    }
                );
                if (res.status !== 200)
                    return console.log("smt wrong while updating");
                showSnackbar(
                    dispatch,
                    "APAGADO! Para mostrar o card de teste de novo, adicione pontos no MODO APP CLIENTE.",
                    "success",
                    7000
                );
                setRun(dispatch, "RecordedClientsList");
            });
        }, 3000);
    };

    const displayCliPrizes = (panel) => {
        const toggledBtn = runArray.includes(panel._id);

        return (
            !toggledBtn && (
                <section
                    className="enabledLink position-absolute"
                    style={styles.trophyPrizes}
                >
                    <div className="position-relative">
                        <div>
                            <img
                                src="/img/icons/trophies/fiddelize-trophy.svg"
                                className="shadow-elevation-black"
                                height="auto"
                                width={50}
                                alt="troféu cliente"
                            />
                        </div>
                        <div
                            className="position-absolute d-none"
                            style={styles.totalPrizesBadge}
                        >
                            <p className="text-shadow font-weight-bold text-small m-0 ml-4 mx-2 text-center text-white p-0">
                                <span className="text-normal font-weight-bold">
                                    {panel.needCliPrizes}
                                </span>
                                x
                            </p>
                        </div>
                        <div
                            className="position-absolute"
                            style={styles.prizesBtn}
                        >
                            <PrizesBtn
                                title="prêmios"
                                size="extra-small"
                                targetId={panel._id}
                                radiusBtn
                            />
                        </div>
                    </div>
                </section>
            )
        );
    };

    const displayTestCardBadgeBtn = (panel) => (
        <div className="enabledLink">
            <ButtonFab
                position="absolute"
                top={-15}
                left={70}
                title="MODO TESTE"
                variant="extended"
                fontWeight="bolder"
                fontSize=".9em"
                color="var(--mainWhite)"
                backgroundColor="var(--niceUiYellow)"
            />
            <RadiusBtn
                size="extra-small"
                title="apagar"
                onClick={() => handleEraseTestCard(panel._id)}
                position="absolute"
                top={-25}
                left={isSmall ? 210 : 239}
            />
        </div>
    );

    const showPanel = (panel) => (
        <div>
            <AccordionSummary
                expandIcon={
                    <div className="enabledLink">
                        {needToggleButton ? (
                            <ToggleBtn cardId={panel._id} />
                        ) : (
                            <ExpandMoreIcon />
                        )}
                    </div>
                }
                aria-controls={`panel${panel._id}bh-content`}
                id={`panel${panel._id}bh-header`}
            >
                {isSmall ? (
                    <div className="d-flex flex-column align-self-start">
                        {panel.mainHeading}
                        {panel.secondaryHeading}
                    </div>
                ) : (
                    <Fragment>
                        <Typography className="ex-pa-main-heading ex-pa--headings">
                            {panel.mainHeading}
                        </Typography>
                        <Typography className="ex-pa--headings">
                            {panel.secondaryHeading}
                        </Typography>
                    </Fragment>
                )}
            </AccordionSummary>
            {panel.needBadgeForTestMode && displayTestCardBadgeBtn(panel)}
            {Boolean(panel.needCliPrizes) && displayCliPrizes(panel)}
        </div>
    );

    const showHiddenPanel = (panel) => (
        <AccordionDetails>{panel.hiddenContent}</AccordionDetails>
    );

    const showAccordion = ({ panel }) => (
        <Accordion
            TransitionProps={{ unmountOnExit: true }}
            className="disabledLink"
            style={styles.Accordion}
        >
            {showPanel(panel)}
            {showHiddenPanel(panel)}
        </Accordion>
    );

    const ActionsMap = actions.map((panel, ind) => {
        const props = {
            key: panel._id,
            className: "position-relative mb-3",
        };

        if (!panel.isVisible) return;

        return checkDetectedElem({ list: actions, ind, indFromLast: 5 }) ? ( // 5 is in the middle of 10 chunks series to avoid detect card after reversing the order. The middle will be untouched unless user scroll down.
            <div {...props} ref={detectedCard}>
                {showAccordion({ panel })}
            </div>
        ) : (
            <div {...props}>{showAccordion({ panel })}</div>
        );
    });

    return <section className={classes.root}>{ActionsMap}</section>;
}
