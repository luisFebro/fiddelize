import React, { Fragment, useState, useEffect } from 'react';
import SmsCard from './card/accordion/SmsCard';
import PanelHiddenContent from './card/card-hidden-content/PanelHiddenContent';
// import SearchFilter from "../../../../../components/search/SearchFilter";
import SearchResult from "../../../../../components/search/SearchResult";
import { calendar } from '../../../../../utils/dates/dateFns';
import parse from 'html-react-parser';
import { convertDotToComma } from '../../../../../utils/numbers/convertDotComma';
import { useAppSystem, useProfile } from '../../../../../hooks/useRoleData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getFirstName from '../../../../../utils/string/getFirstName';
import { useRunComp } from '../../../../../hooks/useRunComp';
import Img from '../../../../../components/Img';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import scrollIntoView from '../../../../../utils/document/scrollIntoView';
import { isScheduledDate } from '../../../../../utils/dates/dateFns';
import useAPIList, { readSMSMainHistory, getTrigger } from '../../../../../hooks/api/useAPIList';
import useElemDetection, { checkDetectedElem } from '../../../../../hooks/api/useElemDetection';
const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    icon: { fontSize: 35, color: "white", filter: "drop-shadow(0.001em 0.001em 0.15em grey)" },
    dateBadge: {
        left: isSmall ? -15 : 0,
        bottom: isSmall ? -30 : -20,
        backgroundColor: "var(--themeP)",
        padding: '0px 15px',
        borderRadius: "20%",
    }
});


const handleSecHeading = (data, styles, forceCancel) => {
    const isScheduled = data.isScheduled;
    const isCanceled = data.isCanceled;
    const needScheduling = isScheduledDate(data.scheduledDate);

    const handleDate = () => {
        if(isScheduled) {
            if(isCanceled || forceCancel === data._id) return `Não enviado ${calendar(data.scheduledDate)}`;
            return needScheduling ? `Agendado para ${calendar(data.scheduledDate)}.` : `Agendado e Enviado ${calendar(data.scheduledDate)}.`
        }
        return `Enviado ${calendar(data.createdAt)}.`;
    }

    return(
        <section>
            <p
                className="text-nowrap position-absolute d-block m-0 mt-3"
                style={styles.dateBadge}
            >
                <span className="text-small text-shadow font-weight-bold">
                    {handleDate()}
                </span>
            </p>
        </section>
    );
}
// END HELPERS

export default function AsyncCardsList() {
    const [skip, setSkip] = useState(0);
    const [forceCancel, setForceCancel] = useState(false); // solve real time update after calling off a scheduled date.
    const { businessId } = useAppSystem();
    const { name } = useProfile();

    const styles = getStyles();

    const { runName, runName2 } = useRunComp();
    const trigger = getTrigger(runName, "UpdateSMSAll");
    const triggerForce = getTrigger(runName2, "ForceCancelScheduled");

    const {
        list,
        loading, ShowLoadingSkeleton,
        error, ShowError,
        needEmptyIllustra,
        hasMore,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readSMSMainHistory(businessId),
        skip,
        trigger,
        listName: "smsCardsList"
    })
    const detectedCard = useElemDetection({ loading, hasMore, setSkip, isOffline });

    useEffect(() => {
        if(triggerForce) {
            const indSpace = triggerForce.indexOf(" ");
            const thisCardId = triggerForce.slice(indSpace + 1);
            setForceCancel(thisCardId);
        }
    }, [triggerForce])

    const displayTotalSMS = ({ isCardIn, data }) => {
        const plural = data.totalSMS > 1 ? "s" : "";

        return(
            <section className="d-flex">
                {isCardIn ? (
                    <FontAwesomeIcon
                        icon="arrow-circle-up"
                        className="mr-2"
                        style={styles.icon}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon="arrow-circle-down"
                        className="mr-2"
                        style={styles.icon}
                    />
                )}
                <span
                    className={`position-relative  d-inline-block ${!isCardIn ? "text-nowrap" : ""} text-subtitle font-weight-bold text-shadow`}
                    style={{ lineHeight: "25px", top: 5 }}
                >
                    {data.totalSMS} SMS {isCardIn ? "adicionados" : `usado${plural}`}
                </span>
            </section>
        );
    }

    const showAccordion = () => {

        const actions = list.map(data => {
            const arrayData = data.firstContacts;
            const contactsLength = data.totalSMS;
            const isCanceled = data.isCanceled;
            const areMoreThanOne = contactsLength > 2;
            const needScheduling = isScheduledDate(data.scheduledDate);
            const firstContactsNames = arrayData && arrayData.map((name, ind) => (arrayData && arrayData.length !== (ind + 1) && areMoreThanOne) ? `${getFirstName(name.cap())}, ` : `${getFirstName(name.cap())}`)

            const handleSendingTitle = () => {
                if(isCanceled) return "• Cancelado para:";
                if(needScheduling) return "• Enviar para:";
                return "• Enviado para:";
            }

            const isCardIn = data.cardType === "in";
            const mainHeading =
            <section className={isCardIn ? `d-flex flex-column align-self-start animated fadeInUp` : `d-flex flex-column align-self-start animated fadeInDown`}>
                {displayTotalSMS({ isCardIn, data })}
                {data.cardType === "out" && (
                    <p
                        className="m-0 mt-3 text-normal text-shadow font-weight-bold"
                        style={{ lineHeight: '19px' }}
                    >
                        {handleSendingTitle()}
                        <br />
                        {areMoreThanOne && (
                            <span className="text-small font-weight-bold">
                                {firstContactsNames} e + {data.totalSMS - 2} outros.
                            </span>
                        )}

                        {contactsLength === 2 && (
                            <span className="text-small font-weight-bold">
                                {firstContactsNames && firstContactsNames[0]} e {firstContactsNames && firstContactsNames[1]}
                            </span>
                        )}

                        {contactsLength === 1 && (
                            <span className="text-small font-weight-bold">
                                {firstContactsNames}
                            </span>
                        )}
                    </p>
                )}
            </section>

            const HiddenPanel =
            <PanelHiddenContent
                data={data}
            />
            const sideHeading = handleSecHeading(data, styles, forceCancel);

            return({
               _id: data._id,
               mainHeading,
               secondaryHeading: sideHeading,
               data,
               hiddenContent: HiddenPanel,
            });
        })

        return(
            <SmsCard
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton={true}
                forceCancel={forceCancel}
            />
        );
    }

    const showEmptyData = () => {

        const handleClick = () => {
            const config = {
                mode: "intoView",
                duration: 3000,
                onDone: () => null,
            }
            scrollIntoView("#recipientOptions", config)
        }

        return(
            <section>
                <Img
                    className="img-fluid margin-auto-90"
                    src="/img/illustrations/empty-sms-history.png"
                    offline={true}
                    alt="sem histórico de SMS"
                    title="No seu aguardo para o primeiro lançamento de envios."
                />
                <div className=" mb-5 container-center">
                    <ButtonFab
                        size="large"
                        title="ENVIAR"
                        position="relative"
                        onClick={handleClick}
                        backgroundColor={"var(--themeSDark--default)"}
                        variant = 'extended'
                    />
                </div>
            </section>
        );
    }

    return (
        <Fragment>
            {needEmptyIllustra ? showEmptyData() : showAccordion()}
            {loading && <ShowLoadingSkeleton size="large" />}
            {error && <ShowError />}
            <ShowOverMsg />
        </Fragment>
    );
}


/*
const showSearchBar = () => (
    <section className="d-none container-center my-4">
        <span className="position-relative">
        </span>
    </section>
);
 */

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/