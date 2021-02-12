import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { convertDotToComma } from '../../../../../utils/numbers/convertDotComma';

// Customized Data
import { useStoreDispatch } from 'easy-peasy';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import { showModalConfYesNo } from '../../../../../redux/actions/modalActions';
import { showSnackbar } from '../../../../../redux/actions/snackbarActions';
import { removeBooking } from '../../../../../redux/actions/staffBookingActions';
import { default as ModalYesNoBtn }  from './modal-conf-yes-no/ModalBtn';
import { default as ModalSelectBtn }  from './modal-select/ModalBtn';
import { default as ModalFormBtn }  from './modal-form/ModalBtn';
// End Customized Data

CashExpansiblePanel.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            mainHeading: PropTypes.string,
            secondaryHeading: PropTypes.any,
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
        width: window.Helper.isSmallScreen() ? '100%' : '95%',
        margin: 'auto',
    }
}));

const getStatusColor = status => {
    switch(status) {
        case "pendente":
            return "#fbc531"; // yellow
        case "pago":
            return "var(--incomeGreen)";
        default:
            return "grey";
    }
}

export default function CashExpansiblePanel({
    actions,
    backgroundColor,
    isCashOut = false,
    needToggleButton = true,
    color,
    setRun,
    run }) {
    const [currPanelId, setCurrPanelId] = useState("");
    const [togglePanel, setTogglePanel] = useState(false);

    const classes = useStyles();

    const dispatch = useStoreDispatch();

    const styles = {
        Accordion: {
            color: color,
            backgroundColor: backgroundColor, // default is paper color
            margin: '40px 0',
        },
        button: {
            transform: 'translate(-50%, -50%)'
        },
        iconContainer: {
            position: 'absolute',
            top: -10,
            left: 10
        },
        heading: {
            fontWeight: 'bold',
            flexBasis: '33.33%',
            flexShrink: 0,
            textShadow: '1px 1px 3px black',
        },
        secondaryHeading: {
            paddingLeft: '10px',
            fontWeight: 'bold',
            flexBasis: '73.33%',
            flexShrink: 0,
            textShadow: '1px 1px 3px black',
        }

    }

    const showPanel = panel => (
        <AccordionSummary
            expandIcon={
                <div
                    style={styles.iconContainer}
                    className="enabledLink"
                >
                    {needToggleButton
                    ? (
                        <ButtonFab
                            backgroundColor="var(--darkBlue)"
                            shadowColor= "var(--mainWhite)"
                            size="small"
                            iconFontAwesome="fas fa-plus"
                            iconMarginLeft="0"
                            iconAfterClick="fas fa-minus"
                            actionAfterClick={{
                                setStatus: setTogglePanel,
                                status: togglePanel,
                                setFunction: () => setCurrPanelId(panel.itemData._id),
                            }}
                        />
                    ) : <ExpandMoreIcon />}
                </div>
            }
            aria-controls={`panel${panel._id}bh-content`}
            id={`panel${panel._id}bh-header`}
        >
            <p
                style={styles.heading}
                className="item-align-center text-title text-em-2-5"
            >
                R$ {convertDotToComma(panel.mainHeading)}
            </p>
            <Typography
                style={styles.secondaryHeading}
            >
                {panel.secondaryHeading}
            </Typography>
        </AccordionSummary>
    );

    const showHiddenPanel = panel => (
        <AccordionDetails>
            {panel.hiddenContent}
        </AccordionDetails>
    );

    const showStatus = panel => (
        isCashOut !== true &&
        <div className="animated zoomIn delay-1s">
            <div className="enabledLink">
                <ModalSelectBtn
                    modal={{
                        title: `Troca Status Operação Financeira`,
                        txtBtn: "Trocar",
                        iconBtn: "fas fa-exchange-alt",
                        modalData: panel.itemData,
                    }}
                    button={{
                        iconFontAwesome: "fas fa-pencil-alt",
                        backgroundColor: "var(--darkBlue)",
                        shadowColor: "var(--mainWhite)",
                        iconMarginLeft: '0px',
                        top: -30,
                        left: 35
                    }}
                    setRun={setRun}
                    run={run}
                />
            </div>
            <div className="disabledLink">
                <ButtonFab
                    top={-27}
                    left={70}
                    fontWeight="bold"
                    title={panel.itemData.statusCheck}
                    variant="extended"
                    style={styles.button}
                    color="var(--mainWhite)"
                    backgroundColor={getStatusColor(panel.itemData.statusCheck)}
                />
            </div>
        </div>
    );

    const showConfigBtns = panel => (
        togglePanel && currPanelId === panel.itemData._id &&
        <div className="animated zoomIn fast">
            <ModalYesNoBtn
                button={{
                    iconFontAwesome: "fas fa-trash-alt",
                    backgroundColor: "var(--darkBlue)",
                    shadowColor: "var(--mainWhite)",
                    iconMarginLeft: '0px',
                    size: "small",
                    top: -33,
                    left: 185
                }}
                modalData={{
                    title: `Confirmação de exclusão`,
                    subTitle: `Excluir operação financeira no valor de:<br /><strong>R$ ${convertDotToComma(panel.itemData[isCashOut ? "cashOutValue" : "cashInValue"])}</strong> ?`,
                    itemId: panel.itemData._id,
                }}
                setRun={setRun}
                run={run}
            />
            <ModalFormBtn
                button={{
                    backgroundColor: "var(--darkBlue)",
                    iconMarginLeft:  '0px',
                    shadowColor: "var(--mainWhite)",
                    variant: "extended",
                    title: "editar info",
                    size: "small",
                    top: -27,
                    left: 250,
                }}
                modalData={{
                    title: `Edição Operação Financeira`,
                    txtBtn: "Atualizar",
                    iconBtn: "fas fa-exchange-alt",
                    isCashOut: isCashOut,
                    itemData: panel.itemData,
                }}
                setRun={setRun}
                run={run}
            />
        </div>
    );

    return (
        <div className={classes.root}>
            {actions.map(panel => (
                <div
                    key={panel.itemData._id}
                    className="position-relative"
                >
                    <Accordion
                        style={styles.Accordion}
                        className="disabledLink"
                    >
                        {showPanel(panel)}
                        {showHiddenPanel(panel)}
                    </Accordion>
                    {showStatus(panel)}
                    {showConfigBtns(panel)}
                </div>
            ))}
        </div>
    );
}
