import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Customized Data
import { useStoreDispatch, useStoreState } from 'easy-peasy';
import './ExpansiblePanel.scss';
import ToggleBtn from './ToggleBtn';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import RadiusBtn from '../../../../../components/buttons/RadiusBtn';
import { removeField } from '../../../../../redux/actions/userActions';
import { setRun } from '../../../../../hooks/useRunComp';
import { showSnackbar } from '../../../../../redux/actions/snackbarActions';
import { useClientAdmin } from '../../../../../hooks/useRoleData';
import PrizesBtn from '../card-hidden-content/modal-content-pages/prizes-gallery/PrizesBtn';
// End Customized Data

const isSmall = window.Helper.isSmallScreen();

UserCardExpansiblePanel.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.object, // parser
            secondaryHeading: PropTypes.object, // parser
            hiddenContent: PropTypes.any
        })
    ).isRequired,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    needToggleButton: PropTypes.bool,
};

const useStyles = makeStyles(theme => ({
    root: {
        width: isSmall ? '100%' : '80%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '15px 0',
        margin: isSmall ? '10px 0 40px' : '10px 80px 40px',
    }
}));

export default function UserCardExpansiblePanel({
    actions,
    backgroundColor,
    color,
    needToggleButton = false, }) {

    const classes = useStyles();

    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();

    const { runArray } = useStoreState(state => ({
       runArray: state.globalReducer.cases.runArray,
    }));


    const styles = {
        expansionPanel: {
            color: color,
            backgroundColor: backgroundColor, // default is paper color
            margin: '25px 0 0',
        },
        totalPrizesBadge: {
            top: 0,
            right: -33,
            borderRadius: '50px',
            backgroundColor: "var(--niceUiYellow)",
            border: '3px solid grey',
            zIndex: 10,
        },
        trophyPrizes: {
            right: 55,
            bottom: 85,
        },
        prizesBtn: {
            bottom: -25,
            left: '50%',
            transform: 'translateX(-50%)',
        }

    }

    const handleEraseTestCard = cardId => {
        showSnackbar(dispatch, "Apagando card de teste...");
        setTimeout(() => {
            removeField(cardId, "clientUserData")
            .then(res => {
                if(res.status !== 200) return console.log("smt wrong while updating")
                showSnackbar(dispatch, "APAGADO! Para mostrar o card de teste de novo, adicione pontos no MODO APP CLIENTE.", "success", 6000);
                setRun(dispatch, "registered");
            })
        }, 3000)
    };

    const displayCliPrizes = (panel) => {
        const toggledBtn = runArray.includes(panel._id);

        return(
            !toggledBtn &&
            <section className="enabledLink position-absolute" style={styles.trophyPrizes}>
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
                    <div className="position-absolute d-none" style={styles.totalPrizesBadge}>
                        <p className="text-shadow font-weight-bold text-small m-0 ml-4 mx-2 text-center text-white p-0">
                            <span
                                className="text-normal font-weight-bold"
                            >{panel.needCliPrizes}</span>
                            x
                        </p>
                    </div>
                    <div className="position-absolute" style={styles.prizesBtn}>
                        <PrizesBtn
                            title= "prêmios"
                            size="extra-small"
                            targetId={panel._id}
                            radiusBtn={true}
                        />
                    </div>
                </div>
            </section>
        );
    }


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

    const showPanel = panel => (
        <div>
            <ExpansionPanelSummary
                expandIcon={
                    <div
                        className="enabledLink"
                    >
                        {needToggleButton
                        ? (
                            <ToggleBtn
                                cardId={panel._id}
                            />
                        ) : <ExpandMoreIcon />}
                    </div>
                }
                aria-controls={`panel${panel._id}bh-content`}
                id={`panel${panel._id}bh-header`}
            >
                {isSmall
                ? (
                    <div className="d-flex flex-column align-self-start">
                        {panel.mainHeading}
                        {panel.secondaryHeading}
                    </div>
                ) : (
                <Fragment>
                    <Typography
                        className="ex-pa-main-heading ex-pa--headings"
                    >
                        {panel.mainHeading}
                    </Typography>
                    <Typography
                        className="ex-pa--headings"
                    >
                        {panel.secondaryHeading}
                    </Typography>
                </Fragment>
                )}
            </ExpansionPanelSummary>
            {panel.needBadgeForTestMode && displayTestCardBadgeBtn(panel)}
            {Boolean(panel.needCliPrizes) && displayCliPrizes(panel)}
        </div>
    );

    const showHiddenPanel = panel => (
        <ExpansionPanelDetails>
            {panel.hiddenContent}
        </ExpansionPanelDetails>
    );

    return (
        <div className={classes.root}>
            {actions.map(panel => (
                <div
                    key={panel._id}
                    className="position-relative"
                >
                    <ExpansionPanel
                        TransitionProps={{ unmountOnExit: true }}
                        className="disabledLink"
                        style={styles.expansionPanel}
                    >
                        {showPanel(panel)}
                        {showHiddenPanel(panel)}
                    </ExpansionPanel>
                </div>
            ))}
        </div>
    );
}
