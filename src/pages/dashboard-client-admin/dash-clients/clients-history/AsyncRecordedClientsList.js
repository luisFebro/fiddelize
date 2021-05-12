import { Fragment, useEffect, useState } from "react";
import { calendar } from "utils/dates/dateFns";
import convertToReal from "utils/numbers/convertToReal";
import { updateUser } from "api/frequent";
import useData, { useBizData } from "init";
import useAPIList, { readAllCliUsers, getTrigger } from "api/useAPIList";
import useRun from "global-data/ui";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import extractStrData from "utils/string/extractStrData";
import { Load } from "components/code-splitting/LoadableComp";
import useElemShowOnScroll from "hooks/scroll/useElemShowOnScroll";
import getFirstName from "utils/string/getFirstName";
import gotArrayThisItem from "utils/arrays/gotArrayThisItem";
import getFilterDate from "utils/dates/getFilterDate";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegisterPanelBtn from "./register-panel-btn/RegisterPanelBtn";
import RegisteredClientsAccordion from "./accordion/RegisteredClientsAccordion";
import PanelHiddenContent from "./card-hidden-content/PanelHiddenContent";
import "./_RecordedClientsList.scss";
import Totals from "./search/Totals";
import ClientsSearch from "./search/ClientsSearch";

const AsyncFreeAccountsLimitMsg = Load({
    loader: () =>
        import(
            "./AsyncFreeAccountsLimitMsg" /* webpackChunkName: "free-limit-msg-lazy" */
        ),
});
const AsyncShowIllustra = Load({
    loader: () =>
        import(
            "./AsyncShowIllustra" /* webpackChunkName: "empty-illustra-comp-lazy" */
        ),
});
const Filters = Load({
    loader: () =>
        import("./search/Filters" /* webpackChunkName: "filters-comp-lazy" */),
});

const truncate = (name, leng) => window.Helper.truncate(name, leng);
const isSmall = window.Helper.isSmallScreen();

const activeArray = [
    "newCustomers",
    "veteranCustomers",
    "birthdayCustomers",
    "buyMoreCustomers",
    "buyLessCustomers",
    "highestSinglePurchases",
    "lowestSinglePurchases",
    "lastPurchases",
    "firstPurchases",
];

const getInfoElem = (target, options = {}) => {
    const { user } = options;
    const getElemMaker = (condition, value, emptyMsg, size) => (
        <Fragment>
            {!condition ? (
                <span
                    className={`${
                        size ? "text-normal" : "text-small"
                    } font-weight-bold`}
                >
                    {emptyMsg}
                </span>
            ) : (
                <span
                    className={`${
                        size ? "text-normal" : "text-small"
                    } font-weight-bold`}
                >
                    {value}.
                </span>
            )}
        </Fragment>
    );
    if (target === "newCustomers") {
        const condition = user.createdAt;
        const value = calendar(user.createdAt);
        const emptyMsg = "Sem data.";
        return getElemMaker(condition, value, emptyMsg);
    }

    if (target === "lastPurchases") {
        const condition =
            user.clientUserData && user.clientUserData.filterLastPurchase;
        const value =
            condition && calendar(user.clientUserData.filterLastPurchase);
        const emptyMsg = "Sem data registrada.";
        return getElemMaker(condition, value, emptyMsg);
    }

    if (target === "birthdayCustomers") {
        const condition =
            user.clientUserData && user.clientUserData.filterBirthday;
        const value = condition && user.birthday;
        const emptyMsg = "Sem data de aniversário.";
        return getElemMaker(condition, value, emptyMsg);
    }

    if (target === "buyMoreCustomers") {
        const condition =
            user.clientUserData && user.clientUserData.totalGeneralPoints;
        const value = convertToReal(
            condition && user.clientUserData.totalGeneralPoints
        );
        const emptyMsg = "R$ 0.00";
        return getElemMaker(condition, `R$ ${value}`, emptyMsg, true);
    }

    if (target === "highestSinglePurchases") {
        const condition =
            user.clientUserData && user.clientUserData.filterHighestPurchase;
        const value = convertToReal(
            condition && user.clientUserData.filterHighestPurchase
        );
        const emptyMsg = "R$ 0.00";
        return getElemMaker(condition, `R$ ${value}`, emptyMsg, true);
    }
};

const handleParams = ({ search, filterName, period, getFilterDate }) => {
    const { day, week: weekCode, month: monthCode, year } = getFilterDate();

    if (search) return { role: "cliente", filter: "alphabeticOrder", search };

    switch (period) {
        case "all":
            return { role: "cliente", filter: filterName };
        case "day":
            return {
                role: "cliente",
                filter: filterName,
                period,
                day,
            };
        case "week":
            return {
                role: "cliente",
                filter: filterName,
                period,
                week: weekCode,
            };
        case "month":
            return {
                role: "cliente",
                filter: filterName,
                period,
                month: monthCode,
            };
        case "year":
            return {
                role: "cliente",
                filter: filterName,
                period,
                year,
            };
        default:
            return { role: "cliente", filter: filterName };
    }
};

export default function AsyncRecordedClientsList() {
    const [skip, setSkip] = useState(0);
    const [isFiltering, setIsFiltering] = useState(false);
    // TO DO: the updated totalActivePoints will be read from INIT only now
    const { bizId, bizPlan } = useBizData();
    const { name } = useData();

    const showCTA = useElemShowOnScroll("#showNewCTA");

    const [data, setData] = useState({
        totalCliUserScores: 0,
        search: "",
        cleared: "",
    });
    const { totalCliUserScores, search, cleared } = data;

    const [filter, setFilter] = useState({
        filterName: "newCustomers",
        period: "all",
        needEmpty: true,
    });

    const { filterName, period, needEmpty } = filter;
    const { runName } = useRun();

    useEffect(() => {
        if ((filterName && period) || runName === "RecordedClientsList") {
            setIsFiltering(true);
            setTimeout(() => {
                setIsFiltering(false);
            }, 4000);
        }
    }, [filterName, period, runName, search, cleared]);

    const handleSearch = (query) => {
        if (query === "_cleared")
            return setData({ ...data, search: "", cleared: true });
        setData({ ...data, search: query, cleared: "" });
    };

    const handleSelectedFilter = (filterData) => {
        setSkip(0);
        setFilter({
            ...filter,
            filterName: filterData.selected,
            needEmpty: filterData.needEmpty,
        });
    };

    const handlePeriodFilter = (filterData) => {
        setSkip(0);
        setFilter({
            ...filter,
            period: filterData.selected,
        });
    };

    // update current amount of accumulative and active scores from all cli-users of which cli-admin.
    // this is necessary so that we can have variables to gather these numbers sincedatabase just process them on the fly
    // useful for central admin to know the general scores from all cli-admins
    useEffect(() => {
        const objToSend = {
            "clientAdminData.totalClientUserPoints": totalCliUserScores,
        };
        updateUser(bizId, "cliente-admin", objToSend);
    }, [totalCliUserScores]);

    const params = handleParams({ search, filterName, period, getFilterDate });

    const trigger = getTrigger(runName, "RecordedClientsList", {
        cond2: `${filterName}_${period}_${search}_${cleared}`,
    });

    const {
        list,
        content,
        loading,
        ShowLoadingSkeleton,
        error,
        ShowError,
        needEmptyIllustra,
        emptyType,
        hasMore,
        isOffline,
        listTotal,
        ShowOverMsg,
    } = useAPIList({
        url: readAllCliUsers(bizId),
        skip,
        params,
        trigger,
        isFiltering,
        listName: "recordedClientsList",
    });

    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
        isFiltering,
    });

    useEffect(() => {
        if (false) {
            // content
            const { totalCliUserScores } = extractStrData(content);
            setData({ ...data, totalCliUserScores });
        }
    }, [content]);

    // Accordion Content
    const highlightActiveScore =
        filterName.indexOf("highestActiveScores") !== -1 ||
        filterName.indexOf("lowestActiveScores") !== -1;
    const defaultCond =
        filterName === "newCustomers" ||
        filterName === "veteranCustomers" ||
        highlightActiveScore ||
        filterName.indexOf("alphabeticOrder") !== -1;

    const actions = list.map((user) => {
        const { clientUserData: cliUser } = user;

        const handleSecHeading = (user) => {
            const getHighlightInfo = (filterName) => {
                const needHighlight = gotArrayThisItem(activeArray, filterName);
                let infoTitle;
                let infoData;

                if (defaultCond) {
                    infoTitle = "• Cadastro feito:";
                    infoData = getInfoElem("newCustomers", { user });
                }

                if (
                    filterName === "lastPurchases" ||
                    filterName === "firstPurchases"
                ) {
                    infoTitle = "• Última compra:";
                    infoData = getInfoElem("lastPurchases", { user });
                }

                if (filterName === "birthdayCustomers") {
                    infoTitle = "• Aniversário em:";
                    infoData = getInfoElem("birthdayCustomers", { user });
                }

                if (
                    filterName === "buyMoreCustomers" ||
                    filterName === "buyLessCustomers"
                ) {
                    infoTitle = "• Já comprou:";
                    infoData = getInfoElem("buyMoreCustomers", { user });
                }

                if (
                    filterName === "highestSinglePurchases" ||
                    filterName === "lowestSinglePurchases"
                ) {
                    infoTitle = "• Maior Compra:";
                    infoData = getInfoElem("highestSinglePurchases", { user });
                }

                return {
                    hightlightThisInfo: needHighlight,
                    infoTitle,
                    infoData,
                };
            };

            const {
                hightlightThisInfo,
                infoTitle,
                infoData,
            } = getHighlightInfo(filterName);

            return (
                <div style={{ marginTop: 45 }}>
                    <p
                        className={`${
                            highlightActiveScore ? "recorded-clients-badge" : ""
                        } text-subtitle text-shadow font-weight-bold m-0 mt-4`}
                        style={{ lineHeight: "19px" }}
                    >
                        {!user.clientUserData.currPoints
                            ? "• 0 Pontos"
                            : ` • ${convertToReal(
                                  user.clientUserData.currPoints
                              )} Pontos`}
                        {Boolean(user.clientUserData.totalPurchasePrize) && (
                            <Fragment>
                                <br />
                                <span className="text-small font-weight-bold">
                                    (Desafio Atual N.º{" "}
                                    {user.clientUserData.totalPurchasePrize + 1}
                                    )
                                </span>
                            </Fragment>
                        )}
                    </p>
                    <span
                        className={`${
                            hightlightThisInfo ? "recorded-clients-badge" : ""
                        } text-shadow text-normal font-weight-bold d-block m-0 mt-3`}
                        style={{ lineHeight: "20px" }}
                    >
                        {infoTitle}
                        <br />
                        {infoData}
                    </span>
                </div>
            );
        };

        const isTestMode = name === user.name.cap();
        const needCliPrizes = cliUser.totalPurchasePrize; // 0 by default.
        const highlightName = filterName.indexOf("alphabeticOrder") !== -1;
        const handleVisible = () => {
            if (needEmpty) return true;
            if (filterName === "birthdayCustomers") {
                return !!cliUser.filterBirthday;
            }
            if (filterName === "buyLessCustomers") {
                return !!cliUser.totalGeneralPoints;
            }
            if (filterName === "firstPurchases") {
                return !!cliUser.filterLastPurchase;
            }
            if (filterName === "lowestActiveScores") {
                return !!cliUser.currPoints;
            }
            if (filterName === "lowestSinglePurchases") {
                return !!cliUser.filterHighestPurchase;
            }
            if (defaultCond) {
                return true;
            }

            return true;
        };
        const isVisible = handleVisible();
        return {
            _id: user._id,
            isVisible,
            mainHeading: (
                <span
                    className={`${
                        highlightName ? "recorded-clients-badge" : ""
                    } position-absolute text-subtitle font-weight-bold text-shadow`}
                >
                    {truncate(
                        getFirstName(user.name.cap(), { addSurname: true }),
                        isSmall ? 17 : 40
                    )}
                </span>
            ),
            secondaryHeading: handleSecHeading(user),
            userData: user,
            needBadgeForTestMode: isTestMode,
            needCliPrizes,
            hiddenContent: (
                <PanelHiddenContent
                    data={user}
                    needBadgeForTestMode={isTestMode}
                />
            ),
        };
    });

    const showAccordion = () => (
        <section id="showNewCTA">
            <RegisteredClientsAccordion
                detectedCard={detectedCard}
                checkDetectedElem={checkDetectedElem}
                actions={actions}
                backgroundColor="var(--themePLight)"
                color="white"
                needToggleButton
            />
        </section>
    );
    // End Accordion Content

    const showFixedCTA = () =>
        showCTA && (
            <section
                className="animated fadeInUp"
                style={{ position: "fixed", bottom: "10px", right: "10px" }}
            >
                <RegisterPanelBtn
                    title="Novo Cadastro"
                    size="medium"
                    isCliAdmin
                    needTeamApp
                />
            </section>
        );

    const needFreeAlert = Boolean(listTotal >= 7 && bizPlan === "gratis");

    const [openSearch, setOpenSearch] = useState(false);

    return (
        <Fragment>
            {listTotal !== 0 || emptyType === "filter" ? (
                <Fragment>
                    {openSearch === false ? (
                        <section className="container-center">
                            <ButtonFab
                                position="relative"
                                size="large"
                                onClick={() => setOpenSearch(true)}
                                color="var(--mainWhite)"
                                backgroundColor="var(--themeSDark)"
                                iconFontAwesome={
                                    <FontAwesomeIcon
                                        icon="search"
                                        style={{ fontSize: 30 }}
                                    />
                                }
                                needIconShadow
                            />
                        </section>
                    ) : (
                        <section className="animated slideInLeft fast">
                            <ClientsSearch handleSearch={handleSearch} />
                        </section>
                    )}
                </Fragment>
            ) : (
                <p className="my-2 font-weight-bold text-purple text-normal text-center">
                    Preparando tudo...
                </p>
            )}
            {openSearch ? (
                <section className="my-3 d-flex justify-content-start">
                    <ButtonFab
                        position="relative"
                        size="small"
                        onClick={() => setOpenSearch(null)}
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeSDark)"
                        needIconShadow
                        variant="extended"
                        title="Filtros e Totais"
                        textTransform=" "
                    />
                </section>
            ) : (
                <Fragment>
                    <Filters
                        listTotal={listTotal}
                        loading={loading}
                        handleSelectedFilter={handleSelectedFilter}
                        handlePeriodFilter={handlePeriodFilter}
                        emptyType={emptyType}
                    />
                    <Totals
                        loading={loading}
                        allUsersLength={listTotal}
                        totalActivePoints={totalActivePoints}
                        totalCliUserScores={totalCliUserScores}
                        period={period}
                    />
                </Fragment>
            )}
            {needEmptyIllustra ? (
                <AsyncShowIllustra emptyType={emptyType} />
            ) : (
                <Fragment>
                    {showAccordion()}
                    {loading && <ShowLoadingSkeleton size="large" />}
                    {error && <ShowError />}
                    <ShowOverMsg />
                    {needFreeAlert && <AsyncFreeAccountsLimitMsg />}
                    {showFixedCTA()}
                </Fragment>
            )}
        </Fragment>
    );
}

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/
