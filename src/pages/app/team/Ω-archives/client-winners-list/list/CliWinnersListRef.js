import { Fragment, useState } from "react";
import CliWinnersCard from "./card/accordion/CliWinnersCard";
import PanelHiddenContent from "./card/card-hidden-content/PanelHiddenContent";
import { calendar } from "../../../../../utils/dates/dateFns";
import useData, { useBizData } from "init";
import getFirstName from "../../../../../utils/string/getFirstName";
import Illustration from "../../../../../components/Illustration";
// import extractStrData from '../../../../../utils/string/extractStrData';
// import { isScheduledDate } from '../../../../../utils/dates/dateFns';
import useAPIList, { readOneMemberTasksList, getTrigger } from "api/useAPIList";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";

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

const handleSecHeading = (data, styles) => (
    <section>
        <p
            className="text-nowrap position-absolute d-block m-0 mt-3"
            style={styles.dateBadge}
        >
            <span className="text-small text-shadow font-weight-bold">
                Feito: {calendar(data.createdAt)}.
            </span>
        </p>
    </section>
);
// END HELPERS

export default function CliWinnersList() {
    const [skip, setSkip] = useState(0);

    const { bizId } = useBizData();
    const [memberId] = useData(["userId"]);

    const styles = getStyles();

    const params = {
        userId: memberId, // for token check
        memberId,
        bizId,
        skip,
    };

    const trigger = getTrigger(null, null, { cond2: 'filter_"{filterBy}"' });
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
        gotData,
        listTotal,
    } = useAPIList({
        url: readOneMemberTasksList(),
        skip,
        params,
        listName: "memberTasksHistory",
        trigger,
    });

    const showNoWinnersImg = () =>
        needEmptyIllustra &&
        !isOffline && (
            <section className="container-center mb-5">
                <Illustration
                    img={
                        "/img/illustrations/empty-cli-winners.svg" ||
                        "/img/error.png"
                    }
                    txtClassName="text-white text-shadow"
                    alt="Ilustração"
                    txtImgConfig={{
                        topPos: "80%",
                        txt: "Nenhum cliente ganhador",
                    }}
                />
            </section>
        );

    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });

    const handleTaskDesc = (task, score) => {
        if (task === "newClient") return "+ Novo Cliente";
        if (task === "newScore") return `+ ${score} Pontos`;
    };

    const displayTask = (task, score) => {
        const taskDesc = handleTaskDesc(task, score);

        return (
            <section className="d-flex">
                <span
                    className="position-relative  d-inline-block text-subtitle font-weight-bold text-shadow"
                    style={{ lineHeight: "25px", top: 5 }}
                >
                    {taskDesc}
                </span>
            </section>
        );
    };

    const showAccordion = () => {
        const actions = list.map((data) => {
            const mainHeading = (
                <section className="d-flex flex-column align-self-start">
                    {displayTask(data.memberTask, data.clientScore)}
                    <p
                        className="m-0 mt-4 text-normal text-shadow font-weight-bold"
                        style={{ lineHeight: "25px" }}
                    >
                        <span className="main-font text-em-1 font-weight-bold">
                            Nome do Cliente:
                            <br />
                            <span className="d-inline-block mt-1 font-weight-bold main-font text-em-1-2">
                                {getFirstName(
                                    data.clientName && data.clientName.cap(),
                                    {
                                        addSurname: true,
                                    }
                                )}
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
                <CliWinnersCard
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

    return (
        <Fragment>
            {gotData && showAccordion()}
            {showNoWinnersImg()}
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
