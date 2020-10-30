import React, { Fragment, useState } from "react";
import TeamTasksCard from "./card/accordion/TeamTasksCard";
import PanelHiddenContent from "./card/card-hidden-content/PanelHiddenContent";
import { calendar } from "../../../../../utils/dates/dateFns";
import { useAppSystem } from "../../../../../hooks/useRoleData";
import getFirstName from "../../../../../utils/string/getFirstName";
import Illustration from "../../../../../components/Illustration";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
// import extractStrData from '../../../../../utils/string/extractStrData';
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
                    Feito: {calendar(data.createdAt)}.
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
        // needEmptyIllustra,
        hasMore,
        isOffline,
        ShowOverMsg,
    } = useAPIList({
        url: readTransactionHistory(),
        skip,
        params,
        listName: "teamTasksList",
    });

    const needEmptyIllustra = false;
    const list = [
        {
            clientName: "Augusta Silva",
            clientScore: 150,
            memberTask: "newScore",
            memberName: "Luis Febro Feitoza Lima",
            memberJob: "admin",
            content: "",
            createdAt: new Date(),
        },
        {
            clientName: "Augusta Silva",
            clientScore: 250, // Cadastrou e pontuou: R$ 250.
            memberTask: "newClient",
            memberName: "Adriana Oliveira da Silva",
            memberJob: "vendas",
            content: "",
            createdAt: new Date(),
        },
    ];

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
                    className={`position-relative  d-inline-block text-subtitle font-weight-bold text-shadow`}
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
                            Pelo membro:
                            <br />
                            <span className="d-inline-block mt-1 font-weight-bold main-font text-em-1-2">
                                {getFirstName(data.memberName, {
                                    addSurname: true,
                                })}
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
            <TeamTasksCard
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
                <div className="container-center my-5">
                    <Illustration
                        img={
                            "/img/illustrations/empty-data.svg" ||
                            "/img/error.png"
                        }
                        txtClassName="text-purple"
                        alt="Sem tarefas"
                        txtImgConfig={{
                            topPos: "50%",
                            txt: "Nenhuma tarefa da equipe",
                        }}
                    />
                </div>
                <div className="mt-3 mb-5 container-center">
                    <ButtonFab
                        size="large"
                        title="CADASTRAR MEMBRO"
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
