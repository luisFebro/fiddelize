import React, { Fragment, useState } from 'react';
import SmsCard from './card/accordion/SmsCard';
import PanelHiddenContent from './card/card-hidden-content/PanelHiddenContent';
// import SearchFilter from "../../../../../components/search/SearchFilter";
import SearchResult from "../../../../../components/search/SearchResult";
import { calendar } from '../../../../../utils/dates/dateFns';
import parse from 'html-react-parser';
import { convertDotToComma } from '../../../../../utils/numbers/convertDotComma';
import { useAppSystem } from '../../../../../hooks/useRoleData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getFirstName from '../../../../../utils/string/getFirstName';
import useAPIList, { readSMSMainHistory, needTrigger } from '../../../../../hooks/api/useAPIList';
import { useRunComp } from '../../../../../hooks/useRunComp';
import ImgLoader from '../../../../../components/ImgLoader';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';
import scrollIntoView from '../../../../../utils/document/scrollIntoView';
// import { showSnackbar } from '../../../../../redux/actions/snackbarActions';
const isSmall = window.Helper.isSmallScreen();
// HELPERS
// const truncate = (name, leng) => window.Helper.truncate(name, leng);
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


const handleSecHeading = (data, styles) => {
    return(
        <section>
            <p
                className="position-absolute d-block m-0 mt-3"
                style={styles.dateBadge}
            >
                <span className="text-small text-shadow font-weight-bold">
                    {calendar(data.createdAt)}.
                </span>
            </p>
        </section>
    );
}
// END HELPERS

export default function AsyncCardsList() {
    const [skip, setSkip] = useState(0);
    const { businessId } = useAppSystem();

    const styles = getStyles();

    const { runName } = useRunComp();
    const trigger = needTrigger(runName, "UpdateSMSAll");
    const { list, needEmptyIllustra } = useAPIList({ url: readSMSMainHistory(businessId), skip, trigger })

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
                    className={`d-inline-block ${!isCardIn ? "text-nowrap" : ""} text-subtitle font-weight-bold text-shadow`}
                    style={{ lineHeight: "25px" }}
                >
                    {data.totalSMS} SMS {isCardIn ? "adicionados" : `usado${plural}`}
                </span>
            </section>
        );
    }

    const showAccordion = () => {

        const actions = list.map(data => {
            const arrayData = data.firstContacts;
            const firstContactsLenght = arrayData && arrayData.length;
            const areMoreThanOne = firstContactsLenght > 2;
            const firstContactsNames = arrayData && arrayData.map((name, ind) => (firstContactsLenght !== (ind + 1) && areMoreThanOne) ? `${getFirstName(name.cap())}, ` : `${getFirstName(name.cap())}`)

            const isCardIn = data.cardType === "in";
            const mainHeading =
            <section className={isCardIn ? `d-flex flex-column align-self-start animated fadeInUp` : `d-flex flex-column align-self-start animated fadeInDown`}>
                {displayTotalSMS({ isCardIn, data })}
                {data.cardType === "out" && (
                    <p
                        className="m-0 mt-3 text-normal text-shadow font-weight-bold"
                        style={{ lineHeight: '19px' }}
                    >
                        • Enviado para:
                        <br />
                        {areMoreThanOne && (
                            <span className="text-small font-weight-bold">
                                {firstContactsNames} e + {data.totalSMS - firstContactsLenght} outros.
                            </span>
                        )}

                        {firstContactsLenght === 2 && (
                            <span className="text-small font-weight-bold">
                                {firstContactsNames && firstContactsNames[0]} e {firstContactsNames && firstContactsNames[1]}
                            </span>
                        )}

                        {firstContactsLenght === 1 && (
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
            const sideHeading = handleSecHeading(data, styles);

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
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton={true}
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
                <ImgLoader
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