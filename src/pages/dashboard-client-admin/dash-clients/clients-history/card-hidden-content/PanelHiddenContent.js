import PropTypes from "prop-types";
import useRun from "global-data/ui";
import InstructionBtn from "components/buttons/InstructionBtn";
import ActionBtns from "./ActionBtns";
// import getFirstName from "utils/string/getFirstName";

PanelHiddenContent.propTypes = {
    data: PropTypes.object.isRequired,
};

export default function PanelHiddenContent({ data }) {
    const { runArray } = useRun();

    const showInfos = () => {
        const infos = {
            // "Última Pontuação": data && data.clientUserData.lastPoints, //
            "Saldo Atual": data && data.clientUserData.currPoints,
            "Pontuação Geral": data && data.clientUserData.totalGeneralPoints,
        };

        const infoKeys = Object.keys(infos);
        const infoValues = Object.values(infos);

        return (
            <div>
                {infoKeys.map((key, ind) => (
                    <p key={key} className="text-shadow text-normal">
                        <span
                            className="font-weight-bold d-block m-0 mt-3"
                            style={{ lineHeight: "20px" }}
                        >
                            • {key}:
                            <br />
                            {infoValues[ind] && infoValues[ind] !== "0" ? (
                                <span className="font-site text-em-0-9 font-weight-bold">
                                    {infoValues[ind]}{" "}
                                    {(key.includes("Pontuação") ||
                                        key.includes("Saldo")) &&
                                        "PTS."}
                                </span>
                            ) : (
                                <span className="text-small font-weight-bold">
                                    Sem pontos.
                                </span>
                            )}
                        </span>
                    </p>
                ))}
            </div>
        );
    };

    const needShowActionBtns = runArray.includes(data._id);

    return (
        needShowActionBtns && (
            <section className="position-relative text-normal enabledLink panel-hidden-content--root">
                {showInfos()}
                <div className="animated flipInY slow delay-1s">
                    <ActionBtns data={data} />
                </div>
                <section
                    className="position-absolute d-flex"
                    style={{ bottom: -15, right: -15 }}
                >
                    <p className="m-0 text-normal text-white text-shadow">
                        Descontar
                        <br />
                        Moedas?{" "}
                    </p>
                    <section className="align-self-end">
                        <InstructionBtn
                            mode="modal"
                            article="ScoreDiscount_art3"
                        />
                    </section>
                </section>
            </section>
        )
    );
}

/* ARCHIVES
const styles = {
    pointsContainer: {
        position: "relative",
    },
};

<p className="animated flip slow delay-2s"> first flip that I was looking for with the style of  a n entire 360 with zooming.
<CreatedAtBr createdAt={createdAt} />
"Feito por":
data &&
data.register &&
getFirstName(data.register.member.cap(), { addSurname: true })

*/
