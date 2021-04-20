import PropTypes from "prop-types";
import { useStoreState } from "easy-peasy";
import TextField from "@material-ui/core/TextField";
import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import { Load } from "../../../../../../../components/code-splitting/LoadableComp";
import copyTextToClipboard from "../../../../../../../utils/document/copyTextToClipboard";

import showToast from "../../../../../../../components/toasts";
import CancelBtn from "./CancelBtn";
import {
    formatDMY,
    isScheduledDate,
    checkToday,
    getLocalHour,
} from "../../../../../../../utils/dates/dateFns";
import getWeekDayBr from "../../../../../../../utils/dates/getWeekDayBr";

const AsyncExtract = Load({
    loader: () =>
        import(
            "./AsyncExtract" /* webpackChunkName: "sms-extract-comp-lazy" */
        ),
});

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

const getStyles = () => ({
    pointsContainer: {
        position: "relative",
    },
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
});

export default function PanelHiddenContent({ data }) {
    const { runArray } = useStoreState((state) => ({
        runArray: state.globalReducer.cases.runArray,
    }));

    const styles = getStyles();

    const handleCopy = () => {
        copyTextToClipboard("#msgArea", () =>
            showToast("Mensagem copiada!", { type: "success" })
        );
    };

    const displayCopyBtn = () => (
        <section className="d-flex justify-content-end my-3">
            <ButtonFab
                size="medium"
                title="Copiar"
                onClick={handleCopy}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
            />
        </section>
    );

    const selectedDate = data.scheduledDate;
    const isToday = checkToday(selectedDate);
    const uiHour = getLocalHour(selectedDate);
    const { isCanceled } = data;

    const needScheduled = isScheduledDate(selectedDate) && !isCanceled;
    const uiDate = `${formatDMY(selectedDate, { short: true })} às ${uiHour} (${
        isToday ? "Hoje" : getWeekDayBr(selectedDate)
    })`;
    const showScheduledDate = () =>
        needScheduled && (
            <section className="my-5">
                <p className="text-white text-normal text-shadow font-weight-bold">
                    ⏰ ENVIO AGENDADO:
                </p>
                <section className="d-flex flex-column flex-md-row">
                    <span className="text-shadow">{uiDate}</span>
                    <div className="ml-md-3">
                        <CancelBtn
                            cardId={data._id}
                            date={`${formatDMY(selectedDate, {
                                short: true,
                            })} às ${uiHour}`}
                        />
                    </div>
                </section>
            </section>
        );

    const handleTitle = () => {
        if (isCanceled) return "Rascunho";
        if (needScheduled) return "Mensagem na Fila";
        return "Mensagem Enviada";
    };

    const showSentMsg = () => (
        <section className="my-5">
            <p className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                {handleTitle()}
            </p>
            <TextField
                multiline
                rows={8}
                id="msgArea"
                name="message"
                InputProps={{
                    style: styles.fieldFormValue,
                }}
                value={data.sentMsgDesc}
                variant="outlined"
                fullWidth
            />
            {displayCopyBtn()}
        </section>
    );

    const showSmsExtract = () => {
        const isOpen = runArray.includes(data._id);

        return isOpen && <AsyncExtract extractId={data._id} />;
    };

    return (
        <section className="position-relative text-normal enabledLink panel-hidden-content--root">
            {showScheduledDate()}
            {showSentMsg()}
            {showSmsExtract()}
        </section>
    );
}

/* ARCHIVES
<p className="animated flip slow delay-2s"> first flip that I was looking for with the style of  a n entire 360 with zooming.
<CreatedAtBr createdAt={createdAt} />
*/
