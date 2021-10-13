import { useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData, { useBizData } from "init";
import getColor from "styles/txt";
import ButtonMulti, {
    faStyle,
} from "../components/buttons/material-ui/ButtonMulti";
import isThisApp from "../utils/window/isThisApp";
import replaceVariablesInTxt from "../utils/string/replaceVariablesInTxt";
import getRegulationText from "./dashboard-client-admin/getRegulationText";
import useBackColor from "../hooks/useBackColor";
import useScrollUp from "../hooks/scroll/useScrollUp";
// import DateWithIcon from "../components/date-time/DateWithIcon";

const isApp = isThisApp();

export default function RegulationPage({ location, match }) {
    const needAppForCliAdmin = location.search.includes("client-admin=1");
    const isFromApp = location.search.includes("app=1");
    const { bizLinkName } = match.params;

    useEffect(() => {
        if (!bizLinkName || isFromApp) return;
        console.log("bizLinkName", bizLinkName);
        (async () => {})();
    }, [bizLinkName, isFromApp]);

    useScrollUp();
    const { firstName: cliFirstName, userGame, adminGame } = useData();

    const currChall = userGame.targetPrize.challN;
    const { targetPoints, prizeDesc } = adminGame.targetPrize;
    const { benefitsExpDays } = adminGame.gameTweaks;

    let { bizName, themePColor, themeSColor, themeBackColor } = useBizData();

    const levelScore = targetPoints && targetPoints / 5;

    useBackColor(`var(--themeBackground--${themeBackColor})`);

    const variablesObj = {
        "nome-empresa": bizName || " ",
        "nome-cliente": cliFirstName || " ",
        "nome-premio": prizeDesc || " ",
        "prazo-premio": `${benefitsExpDays} dias`,
        "ponto-premio": `${targetPoints} pontos`,
        "ponto-nivel": `${levelScore} pontos`,
        "desafio-atual": `${currChall}`,
    };

    const regulationData = {
        benefitsExpDays,
    };

    const showText = () => (
        <main>
            <Paper style={{ backgroundColor: "var(--mainWhite)" }}>
                <div style={{ minHeight: "400px" }} className="text-align py-4">
                    <pre
                        className="text-normal"
                        style={{ whiteSpace: "pre-line" }}
                    >
                        {replaceVariablesInTxt(
                            getRegulationText(regulationData),
                            variablesObj,
                            {
                                needBold: true,
                            }
                        )}
                    </pre>
                </div>
            </Paper>
        </main>
    );

    const showTitle = () => (
        <p
            style={{ top: "20px" }}
            className="position-relative text-center text-white text-title my-4"
        >
            REGRAS DO CLUBE DE COMPRAS - <span>{new Date().getFullYear()}</span>
        </p>
    );

    const handlePath = () => {
        if (needAppForCliAdmin) {
            return "/app?client-admin=1";
        }

        return isApp ? "/app" : "/";
    };

    const showBackBtnAndTimeStamp = () => (
        <div className="d-flex justify-content-between my-5">
            <Link to={handlePath()}>
                <ButtonMulti
                    title="voltar"
                    color={getColor(themePColor).txtColorStyle}
                    backgroundColor={`var(--themeSDark--${themeSColor})`}
                    iconFontAwesome={
                        <FontAwesomeIcon icon="home" style={faStyle} />
                    }
                    shadowColor={themeBackColor === "black" ? "white" : "black"}
                />
            </Link>
        </div>
    );

    return (
        <div className={`theme-back--${themeBackColor} margin-auto-95`}>
            {showTitle()}
            {showText()}
            {showBackBtnAndTimeStamp()}
        </div>
    );
}

/* ARCHIVES
<DateWithIcon
    style={{ color: getColor(themeBackColor).txtColorStyle }}
    date={updatedAt}
    msgIfNotValidDate="Nenhuma alteração."
    marginTop={0}
    needTxtShadow
/>

*/
