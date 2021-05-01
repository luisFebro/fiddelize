import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, {
    faStyle,
} from "../components/buttons/material-ui/ButtonMulti";
import isThisApp from "../utils/window/isThisApp";
import replaceVariablesInTxt from "../utils/string/replaceVariablesInTxt";
import DateWithIcon from "../components/date-time/DateWithIcon";
import getQueryByName from "../utils/string/getQueryByName";
import { useBizData } from "init";
import { currTxtColor } from "../utils/biz/selectTxtStyle";
import pickCurrChallData from "../utils/biz/pickCurrChallData";
import defineCurrChallenge from "../utils/biz/defineCurrChallenge";
import regulationText, {
    updatedAt,
} from "./dashboard-client-admin/regulationText";
import useBackColor from "../hooks/useBackColor";
import useData from "init";
import useScrollUp from "../hooks/scroll/useScrollUp";

const isApp = isThisApp();

export default function RegulationPage({ location }) {
    const needAppForCliAdmin = location.search.includes("client-admin=1");
    const bizLinkName = getQueryByName("bizLinkName", location.search);

    useScrollUp();
    const [cliFirstName] = useData(["firstName"]);

    let {
        bizName,
        mainReward,
        maxScore,
        rewardDeadline,
        themePColor,
        themeSColor,
        themeBackColor,
        rewardList,
        totalPurchasePrize,
    } = useBizData();

    const pickedObj = pickCurrChallData(rewardList, totalPurchasePrize);
    maxScore = pickedObj.rewardScore;
    mainReward = pickedObj.mainReward;

    const currChall = defineCurrChallenge(totalPurchasePrize);

    const rewardScore = maxScore;
    const levelScore = rewardScore && rewardScore / 5;

    useBackColor(`var(--themeBackground--${themeBackColor})`);

    const variablesObj = {
        "nome-empresa": bizName || " ",
        "nome-cliente": cliFirstName || " ",
        "nome-premio": mainReward || " ",
        "prazo-premio": `${rewardDeadline} dias`,
        "ponto-premio": `${rewardScore} pontos`,
        "ponto-nivel": `${levelScore} pontos`,
        "desafio-atual": `${currChall}`,
    };

    const showText = () => (
        <main>
            <Paper style={{ backgroundColor: "var(--mainWhite)" }}>
                <div style={{ minHeight: "400px" }} className="text-align py-4">
                    <pre
                        className="text-normal"
                        style={{ whiteSpace: "pre-line" }}
                    >
                        {replaceVariablesInTxt(regulationText, variablesObj, {
                            needBold: true,
                        })}
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
            REGULAMENTO DO PROGRAMA DE PONTOS -{" "}
            <span>{new Date().getFullYear()}</span>
        </p>
    );

    const handlePath = () => {
        if (needAppForCliAdmin) {
            return "/mobile-app?client-admin=1";
        }

        return isApp ? "/mobile-app" : "/";
    };

    const showBackBtnAndTimeStamp = () => (
        <div className="d-flex justify-content-between my-5">
            <Link to={handlePath()}>
                <ButtonMulti
                    title="voltar"
                    color={currTxtColor(themePColor || "default")}
                    backgroundColor={`var(--themeSDark--${themeSColor})`}
                    iconFontAwesome={
                        <FontAwesomeIcon icon="home" style={faStyle} />
                    }
                    shadowColor={themeBackColor === "black" ? "white" : "black"}
                />
            </Link>
            <DateWithIcon
                style={{ color: currTxtColor(themeBackColor || "default") }}
                date={updatedAt}
                msgIfNotValidDate="Nenhuma alteração."
                marginTop={0}
                needTxtShadow
            />
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

/*
useEffect(() => {
    if(!defaultColor) { // Not changing back to default color in dashboard....
        document.body.style.setProperty('background', `var(--themeBackground--${themeBackColor})`, 'important')
    } else {
        document.body.style.setProperty('background', `var(--themeBackground--default)`, 'important')
        setDefaultColor(true);
    }
}, [themeBackColor, defaultColor]);
 */
