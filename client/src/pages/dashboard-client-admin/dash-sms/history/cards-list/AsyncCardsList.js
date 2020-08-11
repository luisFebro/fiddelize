import React, { Fragment } from 'react';
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
    const { businessId } = useAppSystem();

    const styles = getStyles();

    const list = [
        {
            _id: "123",
            cardType: "out",
            totalSMS: 100,
            firstContacts: ["João Augusto", "Ana Rodrigues"],
            sentMsgDesc: "Hello there!",
            createdAt: new Date()
        },
        {
            _id: "456",
            cardType: "in",
            totalSMS: 2000,
            createdAt: new Date()
        }
    ];

    const displayTotalSMS = ({ isCardIn, data }) => (
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
                {data.totalSMS} SMS {isCardIn ? "adicionados" : "usados"}
            </span>
        </section>
    );

    const showAccordion = () => {

        const actions = list.map(data => {
            const arrayData = data.firstContacts;
            const firstContactsLenght = arrayData && arrayData.length;
            const areMoreThanOne = firstContactsLenght >= 2;
            const firstContactsNames = arrayData && arrayData.map((name, ind) => firstContactsLenght === (ind + 1) ? `${getFirstName(name)}` : `${getFirstName(name)}, `)

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
                        {areMoreThanOne ? (
                            <span className="text-small font-weight-bold">
                                {firstContactsNames} e + {data.totalSMS - firstContactsLenght} outros.
                            </span>
                        ) : (
                            <span className="text-small font-weight-bold">
                                {data.firstContacts}
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

    return (
        <Fragment>
            {showAccordion()}
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