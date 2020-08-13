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
import { useStoreDispatch } from 'easy-peasy';
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
    statusAfterClick: PropTypes.bool,
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
    statusAfterClick,
    needToggleButton = false, }) {
    const classes = useStyles();

    const dispatch = useStoreDispatch();
    const { bizCodeName } = useClientAdmin();

    const styles = {
        expansionPanel: {
            color: color,
            backgroundColor: backgroundColor, // default is paper color
            margin: '25px 0 0',
        },
        totalPrizesBadge: {
            borderRadius: '50px',
            backgroundColor: "var(--themeP--default)",
            border: '3px solid white',
        },
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

    const displayCliPrizes = (panel) => (
        <section className="position-relative" style={styles.trophyPrizes}>
            <div>
                <img
                    src="/img/icons/thophies/fiddelize-trophy.svg"
                    className="shadow-elevation-black"
                    height="auto"
                    width={100}
                    alt="troféis cliente"
                />
            </div>
            <div className="position-absolute" style={styles.totalPrizesBadge}>
                <p className="font-weight-bold text-normal m-0 mx-2 text-center text-purple">
                    <span
                        className="text-subtitle"
                    >{panel.needCliPrizes} </span>
                    x
                </p>
            </div>
            <div className="position-absolute">
                <PrizesBtn
                    backgroundColor="var(--themeSDark)"
                    title= "Ver prêmios"
                    size="small"
                    top={0}
                    targetId={panel._id}
                />
            </div>
        </section>
    );


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
        <Fragment>
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
        </Fragment>
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
