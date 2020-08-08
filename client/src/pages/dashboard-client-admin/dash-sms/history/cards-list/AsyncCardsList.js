import React, { Fragment } from 'react';
import SmsCard from './card/accordion/SmsCard';
import PanelHiddenContent from './card/card-hidden-content/PanelHiddenContent';
// import SearchFilter from "../../../../../components/search/SearchFilter";
import SearchResult from "../../../../../components/search/SearchResult";
import { calendar } from '../../../../../utils/dates/dateFns';
import parse from 'html-react-parser';
import { convertDotToComma } from '../../../../../utils/numbers/convertDotComma';
import { useAppSystem } from '../../../../../hooks/useRoleData';
// import getFirstName from '../../../../../utils/string/getFirstName';
// import { showSnackbar } from '../../../../../redux/actions/snackbarActions';

// HELPERS
const truncate = (name, leng) => window.Helper.truncate(name, leng);
const isSmall = window.Helper.isSmallScreen();

const handleSecHeading = data => {
    return(
        <section>
            <p
                className="text-subtitle text-shadow font-weight-bold m-0 mt-4"
                style={{ lineHeight: '19px' }}
            >
                {!data.fsdfsd
                ? "• 0 Pontos"
                : ` • ${convertDotToComma(data.name)} Pontos`}
                {Boolean(data.name) && (
                    <Fragment>
                        <br />
                        <span className="text-small font-weight-bold">(Desafio Atual N.º 1)</span>
                    </Fragment>
                )}
            </p>
            <span
                className="text-shadow text-normal font-weight-bold d-block m-0 mt-3"
                style={{lineHeight: '20px'}}
            >
                • Última compra:
                <br />
                {!false
                ? <span className="text-small font-weight-bold">Sem data registrada.</span>
                : (
                    <span className="text-small font-weight-bold">
                        {calendar(data.createdAt)}.
                    </span>
                )}
            </span>
        </section>
    );
}
// END HELPERS

export default function AsyncCardsList() {
    const { businessId } = useAppSystem();

    const list = [{ _id: 123, name: "Febro", createdAt: new Date() }];

    const showAccordion = () => {

        const actions = list.map(data => {
            const HiddenPanel = <PanelHiddenContent data={data} />
            const mainHeading =
            <span
                className="text-subtitle font-weight-bold text-shadow"
            >
                {truncate(data.name.cap(), isSmall ? 17 : 40)}
            </span>

            const sideHeading = handleSecHeading(data);

            return({
               _id: data._id,
               mainHeading,
               secondaryHeading: sideHeading,
               userData: data,
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