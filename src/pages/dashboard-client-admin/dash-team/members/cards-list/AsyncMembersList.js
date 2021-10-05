import { Fragment, useState } from "react";
import { calendar } from "utils/dates/dateFns";
import getFirstName from "utils/string/getFirstName";
import { useBizData } from "init";
import useAPIList, { readTeamMemberList, getTrigger } from "api/useAPIList";
import useRun from "global-data/ui";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import MembersCard from "./card/accordion/MembersCard";
import PanelHiddenContent from "./card/card-hidden-content/PanelHiddenContent";
import RegisterPanelBtn from "../../../dash-clients/clients-history/register-panel-btn/RegisterPanelBtn";
// need to handle update when the component amount cuz it is not working sometimes. The element is not detected.
// import useDetectScrollSingle from "../../../../../hooks/scroll/useDetectScrollSingle";
const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    dateBadge: {
        left: isSmall ? -15 : -5,
        bottom: isSmall ? -30 : -20,
        backgroundColor: "var(--themeP)",
        padding: "0px 15px",
        borderRadius: "20px",
    },
});

const handleSecHeading = (data, styles) => (
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
// END HELPERS

export default function AsyncCardsList() {
    const [skip, setSkip] = useState(0);
    const { bizId } = useBizData();

    const styles = getStyles();

    const showCTA = true;
    const showFixedCTA = () =>
        showCTA && (
            <section
                className="animated fadeInUp"
                style={{ position: "fixed", bottom: "10px", right: "10px" }}
            >
                <RegisterPanelBtn
                    title="Novo Membro"
                    isNewMember
                    needTeamApp={false}
                    size="medium"
                />
            </section>
        );

    const params = { bizId, skip };

    const { runName } = useRun();
    const trigger = getTrigger(runName, "teamMemberList") || true;

    const {
        list,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        hasMore,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readTeamMemberList(bizId),
        skip,
        params,
        listName: "teamMemberList",
        trigger,
    });

    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    // scoreAdded or registeredClient - task's desc will be handled in the backend .
    const displayMember = (memberName, job) => (
        <section className="d-flex">
            <span
                className="position-relative  d-inline-block text-subtitle font-weight-bold text-shadow"
                style={{ lineHeight: "25px", top: 5 }}
            >
                {job === "admin"
                    ? "Você"
                    : getFirstName(memberName && memberName.cap(), {
                          addSurname: true,
                      })}
            </span>
        </section>
    );

    const showAccordion = () => {
        const actions = list.map((data) => {
            const mainHeading = (
                <section className="d-flex flex-column align-self-start">
                    {displayMember(data.name, data.job)}
                    <p
                        className="m-0 mt-4 text-normal text-shadow font-weight-bold"
                        style={{ lineHeight: "25px" }}
                    >
                        <span className="main-font text-em-0-9">
                            Atuação:{" "}
                            <span className="main-font text-em-0-9">
                                {data.job}
                            </span>
                        </span>
                    </p>
                </section>
            );

            const HiddenPanel = <PanelHiddenContent data={data} />;
            const sideHeading = handleSecHeading(data, styles);

            return {
                _id: data.createdAt,
                mainHeading,
                secondaryHeading: sideHeading,
                // data here is immutable only. If you need handle a mutable data, set it to teh card's actions iteration.
                data,
                hiddenContent: HiddenPanel,
            };
        });

        return (
            <section id="showNewCTA">
                <MembersCard
                    detectedCard={detectedCard}
                    checkDetectedElem={checkDetectedElem}
                    actions={actions}
                    backgroundColor="var(--themePLight)"
                    color="white"
                    needToggleButton
                />
            </section>
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
            {showFixedCTA()}
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
