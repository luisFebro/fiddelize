import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData, { useBizData } from "init";
import getColor from "styles/txt";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import isThisApp from "utils/window/isThisApp";
import replaceVariablesInTxt from "utils/string/replaceVariablesInTxt";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import removeImgFormat from "utils/biz/removeImgFormat";
import { gameBrNameStore } from "components/biz/GamesBadge";
import getAPI, { getBuyClubRulesData } from "api";
import getRegulationText from "./dashboard-client-admin/getRegulationText";
// import DateWithIcon from "components/date-time/DateWithIcon";

const isApp = isThisApp();

export default function RegulationPage({ location, match }) {
    const isFromApp = location.search.includes("app=1");
    const { bizLinkName } = match.params;

    useScrollUp();
    const {
        expiringCoinsDate: expiringCoinsDateUser,
        firstName: cliFirstName,
        adminGame = {},
    } = useData();

    const { availableGames = [] } = adminGame;
    const benefitsExpDays =
        adminGame.gameTweaks && adminGame.gameTweaks.benefitsExpDays;
    const coinsExpDays =
        adminGame.gameTweaks && adminGame.gameTweaks.coinsExpDays;
    const {
        registerBonusCoins,
        bizLogo,
        bizName,
        themePColor,
        themeSColor,
        themeBackColor,
    } = useBizData();

    // the expiringCoinsOn is also active if there is still a custom expiration date because the expiration is independent and will still running if cli-user doesn't deactivate and it was the system instead.
    let { expiringCoinsOn } = useBizData();
    expiringCoinsOn = Boolean(expiringCoinsOn || expiringCoinsDateUser);

    const [mainData, setAllGamesData] = useState({
        loading: true,
        bizLogo: null,
        bizName: null,
        // expiration
        expiringCoinsOn: null,
        benefitsExpDays: null,
        coinsExpDays: null,
        // theming
        themeBackColor: "default",
        themeSColor: "default",
        themePColor: "default",
        // games data
        availableGames: [],
        targetPoints: {},
        benefits: {},
    });

    useEffect(() => {
        const setAllData = (payload = {}) => {
            setAllGamesData({
                loading: false,
                bizLogo: payload.bizLogo || bizLogo,
                bizName: payload.bizName || bizName,
                expiringCoinsOn: payload.expiringCoinsOn || expiringCoinsOn,
                benefitsExpDays: payload.benefitsExpDays || benefitsExpDays,
                coinsExpDays: payload.coinsExpDays || coinsExpDays,
                registerBonusCoins:
                    payload.registerBonusCoins || registerBonusCoins,
                themeSColor: payload.themeSColor || themeSColor,
                themePColor: payload.themePColor || themePColor,
                themeBackColor: payload.themeBackColor || themeBackColor,
                availableGames: payload.availableGames || availableGames,
                targetPoints: {
                    targetPrize: payload.targetPrize.targetPoints,
                    discountBack: payload.discountBack.targetPoints,
                },
                benefits: {
                    targetPrize: payload.targetPrize.prizeDesc,
                    discountBack: `vale desconto em compras no valor de *R$ ${payload.discountBack.targetMoney}*`,
                },
            });
        };

        if (!bizLinkName || isFromApp)
            return setAllData({
                targetPrize: adminGame.targetPrize,
                discountBack: adminGame.discountBack,
            });

        return getAPI({
            url: getBuyClubRulesData(),
            params: { bizLinkName },
            needAuth: false,
        })
            .then((clubData) => {
                setAllData(clubData);
            })
            .catch(() => setAllGamesData({ loading: false }));

        // eslint-disable-next-line
    }, [bizLinkName, isFromApp]);

    useBackColor(`var(--themeBackground--${mainData.themeBackColor})`);

    const { newImg, width, height } = removeImgFormat(mainData.bizLogo);
    const showTitle = () => (
        <section className="my-5">
            <div className="container-center">
                <img
                    src={newImg}
                    width={width}
                    height={height}
                    alt="logo negócio"
                />
            </div>
            <p className="mt-3 position-relative text-center text-white text-title">
                REGRAS DO CLUBE DE COMPRAS -{" "}
                <span>{new Date().getFullYear()}</span>
            </p>
        </section>
    );

    const showText = () => {
        const variablesObj = {
            "nome-empresa": mainData.bizName || " ",
            "nome-cliente": cliFirstName || "Caro cliente",
        };

        const gameList = mainData.availableGames.map((gameName) => ({
            nameBr: gameBrNameStore[gameName],
            benefitDesc: getGameDesc(gameName, mainData),
        }));

        const regulationData = {
            expiringCoinsOn: mainData.expiringCoinsOn,
            coinsExpDays: mainData.coinsExpDays,
            benefitsExpDays: mainData.benefitsExpDays,
            registerBonusCoins: mainData.registerBonusCoins,
            gameList,
            isFromApp,
        };

        const mainContent = (
            <div style={{ minHeight: "400px" }} className="text-align py-4">
                <pre className="text-normal" style={{ whiteSpace: "pre-line" }}>
                    {replaceVariablesInTxt(
                        getRegulationText(regulationData),
                        variablesObj,
                        {
                            needBold: true,
                        }
                    )}
                </pre>
            </div>
        );

        return (
            <main>
                <Paper style={{ backgroundColor: "var(--mainWhite)" }}>
                    {mainData.loading ? (
                        <p
                            className="text-center text-subtitle font-weight-bold text-purple"
                            style={{
                                padding: "50px 0 500px",
                            }}
                        >
                            Carregando...
                        </p>
                    ) : (
                        mainContent
                    )}
                </Paper>
            </main>
        );
    };

    const handlePath = () => (isApp ? "/app" : "/");

    const showBackBtnAndTimeStamp = () => (
        <div className="d-flex justify-content-between my-5">
            <Link to={handlePath()} className="no-text-decoration">
                <ButtonMulti
                    title={`voltar ${isApp ? "app" : ""}`}
                    color={getColor(mainData.themePColor).txtColorStyle}
                    backgroundColor={`var(--themeSDark--${mainData.themeSColor})`}
                    iconFontAwesome={
                        <FontAwesomeIcon icon="arrow-right" style={faStyle} />
                    }
                    shadowColor={themeBackColor === "black" ? "white" : "black"}
                />
            </Link>
        </div>
    );

    return (
        <div
            className={`theme-back--${mainData.themeBackColor} margin-auto-95`}
        >
            {showTitle()}
            {showText()}
            {showBackBtnAndTimeStamp()}
        </div>
    );
}

// HELPERS
function getGameDesc(game = "", data = {}) {
    if (game === "targetPrize")
        return `acumule e bata a meta de *${data.targetPoints[game]} PTS* e ganhe prêmio: *${data.benefits[game]}*`;
    if (game === "discountBack")
        return `a cada *${data.targetPoints[game]} PTS*, ganhe ${data.benefits[game]}`;

    return "";
}
// END HELPERS

/* ARCHIVES
<DateWithIcon
    style={{ color: getColor(themeBackColor).txtColorStyle }}
    date={updatedAt}
    msgIfNotValidDate="Nenhuma alteração."
    marginTop={0}
    needTxtShadow
/>

*/
