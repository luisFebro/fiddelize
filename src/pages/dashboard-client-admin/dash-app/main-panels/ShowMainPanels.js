import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadableVisible from "components/code-splitting/LoadableVisible";
import ConfigExpansiblePanel from "./ConfigExpansiblePanel";
import AppDesign from "../design/AppDesign";
import MainBuyGames from "../buy-games/MainBuyGames";
import DigitalCoins from "../digital-coins/DigitalCoins";

const AsyncBuyClubRules = LoadableVisible({
    loader: () =>
        import(
            "../buy-club-rules/BuyClubRules" /* webpackChunkName: "buy-club-rules-page-lazy" */
        ),
});

const faStyle = {
    fontSize: "40px",
    filter: "drop-shadow(.5px .5px 1.5px black)",
    color: "white",
};

export default function ShowMainPanels(options = {}) {
    const { isDigitalMenu = false } = options;

    let configList = [
        {
            id: 0,
            name: "Design<br />Geral",
            leftIcon: <FontAwesomeIcon icon="palette" />,
            hiddenContent: <AppDesign />,
        },
        {
            id: 1,
            name: "Jogos<br />de Compra",
            leftIcon: <FontAwesomeIcon icon="gamepad" />,
            hiddenContent: <MainBuyGames />,
        },
        {
            id: 2,
            name: "Moedas<br />Digitais",
            leftIcon: <FontAwesomeIcon icon="coins" />,
            hiddenContent: <DigitalCoins />,
        },
        {
            id: 3,
            name: "Regras<br />do Clube",
            leftIcon: <FontAwesomeIcon icon="users" />,
            hiddenContent: <AsyncBuyClubRules />,
        },
    ];

    if (isDigitalMenu) {
        configList = [
            {
                id: 0,
                name: "Design<br />Geral",
                leftIcon: <FontAwesomeIcon icon="palette" />,
                hiddenContent: <AppDesign />,
            },
            {
                id: 1,
                name: "Jogos<br />de Compra",
                leftIcon: <FontAwesomeIcon icon="gamepad" />,
                hiddenContent: <MainBuyGames isDigitalMenu={isDigitalMenu} />,
            },
        ];
    }

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
        <section style={{ marginBottom: 150 }}>
            <ConfigExpansiblePanel
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton={false}
            />
        </section>
    );
}
