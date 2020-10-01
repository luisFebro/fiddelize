import React, { Fragment, useState, useEffect } from "react";
import InvestCard from "./card/accordion/InvestCard";
import PanelHiddenContent from "./card/card-hidden-content/PanelHiddenContent";
import { calendar } from "../../../../../utils/dates/dateFns";
import parse from "html-react-parser";
import { convertDotToComma } from "../../../../../utils/numbers/convertDotComma";
import { useAppSystem } from "../../../../../hooks/useRoleData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getFirstName from "../../../../../utils/string/getFirstName";
import { useRunComp } from "../../../../../hooks/useRunComp";
import Img from "../../../../../components/Img";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
// import { isScheduledDate } from '../../../../../utils/dates/dateFns';
import useAPIList, {
    readSMSMainHistory,
} from "../../../../../hooks/api/useAPIList";
import useElemDetection, {
    checkDetectedElem,
} from "../../../../../hooks/api/useElemDetection";
const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    icon: {
        fontSize: 35,
        color: "white",
        filter: "drop-shadow(0.001em 0.001em 0.15em grey)",
    },
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
                    Em {calendar(data.createdAt)}.
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

    const {
        list,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        needEmptyIllustra,
        hasMore,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readSMSMainHistory(businessId),
        skip,
        listName: "investCardsList",
    });
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    const displayPlanType = (data) => {
        const planDesc = "P. Bronze Mensal";
        const plan = "ouro";

        const handleColor = (plan) => {
            if (plan === "ouro") return "yellow";
            if (plan === "prata") return "white";
            if (plan === "bronze") return "#edbead";
        };

        return (
            <section className="d-flex">
                <FontAwesomeIcon
                    icon="crown"
                    className="mr-2"
                    style={{
                        ...styles.icon,
                        color: handleColor(plan),
                        filter:
                            plan === "bronze"
                                ? "drop-shadow(black 0.001em 0.001em 0.5em)"
                                : "drop-shadow(0.001em 0.001em 0.15em grey)",
                    }}
                />
                <span
                    className={`position-relative  d-inline-block text-subtitle font-weight-bold text-shadow`}
                    style={{ lineHeight: "25px", top: 5 }}
                >
                    {planDesc}
                </span>
            </section>
        );
    };

    const showAccordion = () => {
        const actions = list.map((data) => {
            const mainHeading = (
                <section className="d-flex flex-column align-self-start">
                    {displayPlanType(data)}
                    <p
                        className="m-0 mt-4 text-normal text-shadow font-weight-bold"
                        style={{ lineHeight: "25px" }}
                    >
                        <span className="main-font text-em-1-4 font-weight-bold">
                            R$ 150,0
                        </span>
                        <br />
                        <span className="main-font text-em-1 font-weight-bold">
                            via boleto.
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
                data,
                hiddenContent: HiddenPanel,
            };
        });

        return (
            <InvestCard
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton={true}
            />
        );
    };

    const showEmptyData = () => {
        return (
            <section>
                <Img
                    className="img-fluid margin-auto-90"
                    src="/img/illustrations/empty-sms-history.png"
                    offline={true}
                    alt="club pro - boas vindas"
                    title="Entre para o club e comece a fiddelizar!"
                />
                <div className=" mb-5 container-center">
                    <ButtonFab
                        size="large"
                        title="ENTRAR"
                        position="relative"
                        onClick={null}
                        backgroundColor={"var(--themeSDark--default)"}
                        variant="extended"
                    />
                </div>
            </section>
        );
    };

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
