import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfigExpansiblePanel from "./ConfigExpansiblePanel";
import HiddenDesignApp from "../card-hidden-content/design/HiddenDesignApp";
import HiddenChallengesAndPrize from "../card-hidden-content/challenges-prizes/HiddenChallengesAndPrize";

const faStyle = {
    fontSize: "40px",
    filter: "drop-shadow(.5px .5px 1.5px black)",
    color: "white",
};

export default function ShowExpansiblePanel() {
    const configList = [
        {
            id: 0,
            name: "Design<br />Personalizado",
            leftIcon: <FontAwesomeIcon icon="palette" />,
            hiddenContent: <HiddenDesignApp />,
        },
        {
            id: 1,
            name: "Desafios e<br />Prêmios",
            leftIcon: <FontAwesomeIcon icon="gem" />,
            hiddenContent: <HiddenChallengesAndPrize />,
        },
    ];

    const handleMainHeading = (config) => (
        <section className="card-main-heading--root">
            <div className="icon" style={faStyle}>
                {config.leftIcon}
            </div>
            <p className="text text-nowrap text-subtitle font-weight-bold text-shadow">
                {parse(config.name)}
            </p>
        </section>
    );

    const actions = configList.map((config) => ({
        _id: config.id,
        mainHeading: handleMainHeading(config),
        secondaryHeading: null,
        configData: config,
        hiddenContent: config.hiddenContent,
    }));

    return (
        <ConfigExpansiblePanel
            actions={actions}
            backgroundColor="var(--themePLight)"
            color="white"
            needToggleButton={false}
        />
    );
}
