import React, { useState, useEffect, Fragment } from 'react';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import { dateFnsUtils, ptBRLocale } from '../../../../../utils/dates/dateFns';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import getTimezoneDate from '../../../../../utils/dates/getTimezoneDate';
import { formatDMY, getLocalHour, checkToday } from '../../../../../utils/dates/dateFns';
import getWeekDayBr from '../../../../../utils/dates/getWeekDayBr';
import useAPI, { sendSMS, getUniqueId } from '../../../../../hooks/api/useAPI';
import scrollIntoView from '../../../../../utils/document/scrollIntoView';

const muiTheme = createMuiTheme({
    overrides: {
        MuiPickersToolbar: {
            toolbar: { fontFamily: 'var(--themeP)', backgroundColor: 'var(--themeP)' }
        },
        MuiPickersDay: {
            daySelected: { fontFamily: 'var(--themeP)', backgroundColor: 'var(--themeP)' }
        },
        MuiPickersClock: {
            pin: { backgroundColor: 'var(--themeS)' },
            clock: {
                backgroundColor: 'var(--themePLight)'
            }
        },
        MuiPickersClockNumber: {
            clockNumber: { font: 'bold 18px var(--mainFont)', color: '#fff' },
            clockNumberSelected: { color: 'black' }
        },
        MuiPickersClockPointer: {
            noPoint: { backgroundColor: 'var(--themeS)' },
            pointer: { backgroundColor: 'var(--themeS)' },
            thumb: { border: '14px solid var(--themeS)' },
        },
        MuiTypography: {
            body1: { font: 'bold 18px var(--mainFont)', textTransform: 'uppercase', color: 'var(--themeP)'},
            caption: { fontSize: '1.1rem' },
        },
    }
});

export default function AsyncSchedulerContent({ modal, handleFullClose }) {
    const {
        userId,
        whichTab,
        contactList,
        message,
        handleShowMessage,
    } = modal;

    const [selectedDate, handleDateChange] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [done, setDone] = useState(false);
    const [data, setData] = useState({
        uiDay: new Date(),
        uiHour: new Date(),
        sysDay: new Date(),
        sysHour: new Date(),
    })
    const { uiDay, uiHour, sysDay, sysHour } = data;
    const [trigger, setTrigger] = useState(false);

    const uniqueId = getUniqueId();
    const runName = `UpdateSMSAll ${uniqueId}`; // This should run inside useAPI because when close Modal, the data is wasted and not updated.

    const isToday = checkToday(selectedDate);

    const { data: doneMsg, loading, setRun, dispatch } = useAPI({
        method: 'post',
        url: sendSMS(),
        body: {
            userId,
            contactList,
            msg: message,
            jobdate: sysDay,
            jobtime: sysHour,
        },
        needAuth: true,
        snackbar: { txtPending: "Agendando o envio. Um momento...", txtSuccess: `Agendamento realizado para ${isToday ? "Hoje" : uiDay} às ${uiHour}!` },
        trigger,
        runName,
    })

    useEffect(() => {
        if(doneMsg && !loading) {
            setDisabled(false);
            handleFullClose();
            handleShowMessage(false);

            // const handleCallback = () => {
            // }

            const config = {
                mode: "center",
                duration: 3000,
                onDone: () => null,
            }

            scrollIntoView("#smsHistoryTotals", config);
        }
    }, [doneMsg, loading])


    useEffect(() => {
        setData({
            uiDay: `${formatDMY(selectedDate, { short: true })} (${isToday ? "Hoje" : getWeekDayBr(selectedDate)})`,
            uiHour: getLocalHour(selectedDate),
            sysDay: getTimezoneDate('day', { newDate: selectedDate }),
            sysHour: getTimezoneDate('hour', { newDate: selectedDate }),
        })
    }, [selectedDate])

    const handleSchedule = () => {
        setTrigger(uniqueId);
    }

    const openPicker = () => {
        setOpen(true);
        setDone(false);
    }

    const closePicker = () => {
        setOpen(false);
        setDone(true);
    }

    const showTitle = () => (
        <div className="mt-5">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                Agendamento de Envio
            </p>
        </div>
    );

    const picker = () => {
        const todayLabel =
        <p className="text-small text-purple">
            Hoje
        </p>

        const cancelLabel =
        <p className="text-small text-purple">
            Voltar
        </p>

        const okLabel =
        <p className="text-small text-purple font-weight-bold">
            Pronto!
        </p>

        return(
            <section className="container-center" style={{visibility: 'hidden'}}>
                <ThemeProvider theme={muiTheme}>
                    <MuiPickersUtilsProvider
                        utils={dateFnsUtils}
                        locale={ptBRLocale}
                    >
                        <DateTimePicker
                            open={open}
                            variant="outlined"
                            minutesStep={5}
                            autoOk={false}
                            margin="dense"
                            value={selectedDate}
                            onChange={handleDateChange}
                            onClose={closePicker}
                            onOpen={openPicker}
                            showTodayButton={true}
                            todayLabel={todayLabel}
                            cancelLabel={cancelLabel}
                            okLabel={okLabel}
                            disablePast
                            ampm={false}
                        />
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
            </section>
        );
    }

    const datePickerBtn = () => {
        return(
            !done &&
            <section>
                <p className="font-weight-bold text-normal text-purple text-center">
                    Escolha dia e horário:
                </p>
                <div className="mb-5 container-center">
                    <ButtonFab
                        size="large"
                        title="ESCOLHER"
                        position="relative"
                        onClick={openPicker}
                        backgroundColor={"var(--themeSDark--default)"}
                        variant = 'extended'
                    />
                </div>
            </section>
        );
    }

    const numContacts = contactList.length;
    const plural = numContacts > 1 ? "s" : "";

    const showSummary = () => (
        done &&
        <Fragment>
            <section className="mb-5 text-purple text-normal text-left ml-3">
                <p className="m-0 mb-3 text-purple text-subtitle text-center font-weight-bold">
                    RESUMO
                </p>
                ✔ DIA: <span className="text-purple text-normal font-weight-bold">{uiDay}</span>
                <br />
                ✔ HORA: <span className="text-purple text-normal font-weight-bold">{uiHour}</span>
                <br />
                ✔ ENVIO PARA: <span className="text-purple text-normal font-weight-bold">{whichTab}</span>
                <br />
                ✔ TOTAL: <span className="text-purple text-normal font-weight-bold">{numContacts} contato{plural}.</span>
                <br />
                ✔ MENSAGEM: <span className="text-purple text-normal font-weight-bold">{message}</span>
            </section>
            <div className="mb-5 d-flex justify-content-around align-items-center">
                <ButtonFab
                    size="medium"
                    title="Mudar"
                    position="relative"
                    onClick={openPicker}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant = 'extended'
                />
                <ButtonFab
                    size="large"
                    title="AGENDAR"
                    disabled={disabled}
                    position="relative"
                    onClick={handleSchedule}
                    backgroundColor={"var(--themeSDark--default)"}
                    variant = 'extended'
                />
            </div>
        </Fragment>
    );

    const showIllustra = () => (
        <section className="my-5 mx-5">
            <img
                className="img-fluid"
                src="/img/illustrations/sms-scheduling.svg"
                alt="agendamento"
            />
        </section>
    );

    return (
        <section>
            {showTitle()}
            {showIllustra()}
            {picker()}
            {datePickerBtn()}
            {showSummary()}
        </section>
    );
}