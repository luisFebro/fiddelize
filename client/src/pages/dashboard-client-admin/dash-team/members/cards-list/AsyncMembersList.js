import React, { Fragment, useState } from "react";
import MembersCard from "./card/accordion/MembersCard";
import PanelHiddenContent from "./card/card-hidden-content/PanelHiddenContent";
import { calendar } from "../../../../../utils/dates/dateFns";
import { useAppSystem } from "../../../../../hooks/useRoleData";
import getFirstName from "../../../../../utils/string/getFirstName";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
// import { isScheduledDate } from '../../../../../utils/dates/dateFns';
import useAPIList, {
    readTransactionHistory,
} from "../../../../../hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "../../../../../hooks/api/useElemDetection";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    dateBadge: {
        left: isSmall ? -15 : 0,
        bottom: isSmall ? -30 : -20,
        backgroundColor: "var(--themeP)",
        padding: "0px 15px",
        borderRadius: "20%",
    },
});

const handleSecHeading = (data, styles) => {
    return (
        <section>
            <p
                className="text-nowrap position-absolute d-block m-0 mt-3"
                style={styles.dateBadge}
            >
                <span className="text-small text-shadow font-weight-bold">
                    Cadastro: {calendar(data.createdAt)}.
                </span>
            </p>
        </section>
    );
};
// END HELPERS

export default function AsyncCardsList() {
    const [skip, setSkip] = useState(0);
    const { businessId } = useAppSystem();

    const styles = getStyles();

    const params = { userId: businessId, skip };

    const {
        // list,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        hasMore,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readTransactionHistory(),
        skip,
        params,
        listName: "teamTasksList",
    });

    // do not forget to include admin in this list in the register in DB
    const list = [
        {
            memberName: "Luis Febro Feitoza Lima", // it will be name
            memberJob: "admin",
            content: "newClientTotal:30;newScoreTotal:12;",
            createdAt: new Date(),
        },
        {
            memberName: "Adriana Oliveira da Silva",
            memberJob: "vendas",
            content: "newClientTotal:5;newScoreTotal:3;",
            createdAt: new Date(),
        },
    ];

    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    // scoreAdded or registeredClient - task's desc will be handled in the backend .
    const displayMember = (memberName) => {
        return (
            <section className="d-flex">
                <span
                    className={`position-relative  d-inline-block text-subtitle font-weight-bold text-shadow`}
                    style={{ lineHeight: "25px", top: 5 }}
                >
                    {getFirstName(memberName, { addSurname: true })}
                </span>
            </section>
        );
    };

    const showAccordion = () => {
        const actions = list.map((data) => {
            const mainHeading = (
                <section className="d-flex flex-column align-self-start">
                    {displayMember(data.memberName)}
                    <p
                        className="m-0 mt-4 text-normal text-shadow font-weight-bold"
                        style={{ lineHeight: "25px" }}
                    >
                        <span className="main-font text-em-1 font-weight-bold">
                            Atuação:{" "}
                            <span className="font-weight-bold main-font text-em-1-2">
                                {data.memberJob}
                            </span>
                        </span>
                    </p>
                </section>
            );

            const HiddenPanel = <PanelHiddenContent data={data} />;
            const sideHeading = handleSecHeading(data, styles);

            return {
                _id: data._id,
                mainHeading,
                secondaryHeading: sideHeading,
                // data here is immutable only. If you need handle a mutable data, set it to teh card's actions iteration.
                data,
                hiddenContent: HiddenPanel,
            };
        });

        return (
            <MembersCard
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton={true}
            />
        );
    };

    // This is not necessary here, since the admin will be included and thus already have a member.
    // const showEmptyData = () => {
    // };

    return (
        <Fragment>
            {showAccordion()}
            {loading && <ShowLoadingSkeleton size="large" />}
            {error && <ShowError />}
            <ShowOverMsg />
        </Fragment>
    );
}

/* ARCHIVES
<span className="main-font text-em-1 font-wight-bold">
    Atuação: {data.jobRole.cap()}.
</span>

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
