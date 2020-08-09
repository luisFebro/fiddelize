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

// HELPERS
// const truncate = (name, leng) => window.Helper.truncate(name, leng);

const getStyles = () => ({
    icon: { fontSize: 35, color: "white", filter: "drop-shadow(0.001em 0.001em 0.15em grey)" },
});


const handleSecHeading = data => {
    const arrayData = data.firstContacts;
    const firstContactsLenght = arrayData && arrayData.length;
    const areMoreThanOne = firstContactsLenght >= 2;
    const firstContactsNames = arrayData && arrayData.map((name, ind) => firstContactsLenght === (ind + 1) ? `${getFirstName(name)}` : `${getFirstName(name)}, `)

    return(
        <section>
            {data.cardType === "out" && (
                <p
                    className="m-0 mt-4 text-normal text-shadow font-weight-bold"
                    style={{ lineHeight: '19px' }}
                >
                    • Enviado para:
                    <br />
                    {areMoreThanOne ? (
                        <span className="text-small font-weight-bold">
                            {firstContactsNames} e mais {data.totalSMS - firstContactsLenght} contatos.
                        </span>
                    ) : (
                        <span className="text-small font-weight-bold">
                            {data.firstContacts}
                        </span>
                    )}
                </p>
            )}
            <p
                className="d-block m-0 mt-3"
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
            firstContacts: ["João Augusto", "Ana Rodrigues", "Maria da Silva"],
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

    const showAccordion = () => {

        const actions = list.map(data => {
            const isCardIn = data.cardType === "in";
            const mainHeading =
            <section className={isCardIn ? `d-flex animated fadeInUp delay-1s` : `delay-1s d-flex animated fadeInDown`}>
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
                    className="d-inline-block text-subtitle font-weight-bold text-shadow"
                    style={{ lineHeight: "25px" }}
                >
                    {data.totalSMS} SMS {isCardIn ? "adicionados" : "usados"}
                </span>
            </section>

            const HiddenPanel = <PanelHiddenContent data={data} />
            const sideHeading = handleSecHeading(data);

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