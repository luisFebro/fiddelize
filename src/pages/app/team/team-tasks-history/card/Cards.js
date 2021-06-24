import getFirstName from "utils/string/getFirstName";
import { fromNow } from "utils/dates/dateFns";
import TeamTasksCard from "./accordion/TeamTasksCard";
import PanelHiddenContent from "./card-hidden-content/PanelHiddenContent";

export default function Cards({ list, detectedCard, checkDetectedElem }) {
    const actions = list.map((data) => {
        const MainHeading = <MainH data={data} />;
        const SecondaryHeading = <SecHeading data={data} />;
        const HiddenPanel = <PanelHiddenContent data={data} />;

        return {
            _id: data.createdAt,
            mainHeading: MainHeading,
            secondaryHeading: SecondaryHeading,
            hiddenContent: HiddenPanel,
            // data here is immutable only. If you need handle a mutable data, set it to teh card's actions iteration.
            data,
        };
    });

    return (
        <section id="showNewCTA">
            <TeamTasksCard
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton
            />
        </section>
    );
}

// COMPS
function MainH({ data }) {
    function DisplayTask({ task, points }) {
        const handleTaskDesc = () => {
            if (task === "newClient") return "+ Novo Cliente";
            if (task === "newPoints") return `+ ${points} Pontos`;
            if (task === "newBenefit") return `+ Benefício`;
            return null;
        };

        const taskDesc = handleTaskDesc();

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
    }

    return (
        <section className="d-flex flex-column align-self-start">
            <DisplayTask task={data.memberTask} points={data.value} />
            <p
                className="m-0 mt-4 text-normal text-shadow font-weight-bold"
                style={{ lineHeight: "25px" }}
            >
                <span className="main-font text-em-0-9 font-weight-bold">
                    cliente:
                    <br />
                    <span className="text-pill d-inline-block mt-1 font-weight-bold main-font text-em-1-2">
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
}

function SecHeading({ data }) {
    return (
        <section>
            <p className="team-tasks date-badge text-nowrap position-relative d-block m-0 mt-2">
                <span className="text-small text-shadow font-weight-bold">
                    Feito {fromNow(data.createdAt)}.
                </span>
                <style jsx>
                    {`
                        .team-tasks.date-badge {
                            backgroundcolor: var(--themeP);
                            borderradius: 20%;
                        }
                    `}
                </style>
            </p>
        </section>
    );
}
// END COMPS
