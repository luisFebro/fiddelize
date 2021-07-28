import { Fragment, useEffect, useState } from "react";
import convertToReal from "utils/numbers/convertToReal";
import useData, { useBizData } from "init";
import useAPIList, { readAllCliUsers, watchTrigger } from "api/useAPIList";
import useRun from "global-data/ui";
import useElemDetection, { checkDetectedElem } from "api/useElemDetection";
import { Load } from "components/code-splitting/LoadableComp";
import useElemShowOnScroll from "hooks/scroll/useElemShowOnScroll";
import getFirstName from "utils/string/getFirstName";
import getFilterDate from "utils/dates/getFilterDate";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchField, { ROOT } from "components/search/SearchField";
import getHighlightFilterData from "./helpers/getHighlightFilterData";
import RegisterPanelBtn from "./register-panel-btn/RegisterPanelBtn";
import RegisteredClientsAccordion from "./accordion/RegisteredClientsAccordion";
import PanelHiddenContent from "./card-hidden-content/PanelHiddenContent";
import "./_RecordedClientsList.scss";
import Totals from "./search/Totals";

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

export default function AsyncRecordedClientsList() {
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({
        filterName: "",
        period: "",
    });
    const { filterName, period } = filter;

    const {
        bizId,
        bizPlan,
        countCliUsersGeneralPoints,
        countCliUsersCurrPoints,
        countCliUsers,
    } = useBizData();
    const { userId: adminId } = useData();

    const showCTA = useElemShowOnScroll("#showNewCTA");

    // UPDATE
    const { runName } = useRun(); // for update list from other comps
    const comp = "RecordedClientsList";

    const trigger = watchTrigger({
        runName,
        comp,
        triggerVars: `${filterName}_${period}_${search}`,
    });

    useClearSkip({
        filter: filterName,
        search,
        setSkip,
        runName,
    });

    const params = handleParams({ search, filterName, period });
    // END UPDATE

    const {
        list,
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
        listName: "recordedClientsList",
        trigger,
    });

    // SEARCH
    const [openSearch, setOpenSearch] = useState(false);

    function showSearch() {
        const autocompleteProps = {
            placeholder: "procure um cliente",
            noOptionsText: "Nenhum cliente encontrado",
            disableOpenOnFocus: true,
            offlineKey: "history_adminClients",
        };

        const handleSearch = (entry) => {
            if (entry === "_cleared") {
                setSearch("");
                return;
            }

            setSkip(0);
            setSearch(entry);
        };

        return (
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
                        <SearchField
                            callback={handleSearch}
                            searchUrl={`${ROOT}/sms/read/contacts?userId=${adminId}&autocomplete=true&autocompleteLimit=7`}
                            autocompleteProps={autocompleteProps}
                        />
                    </section>
                )}
            </Fragment>
        );
    }
    // END SEARCH

    // FILTER
    function showFilter() {
        const handleMainFilter = (filterData) => {
            setFilter({
                ...filter,
                filterName: filterData.selected,
            });
        };

        const handlePeriodFilter = (filterData) => {
            setFilter({
                ...filter,
                period: filterData.selected,
            });
        };

        return (
            <Filters
                listTotal={listTotal}
                loading={loading}
                handleMainFilter={handleMainFilter}
                handlePeriodFilter={handlePeriodFilter}
                emptyType={emptyType}
            />
        );
    }
    // END FILTER

    // INFINITY LOADING LIST
    const detectedCard = useElemDetection({
        loading,
        hasMore,
        setSkip,
        isOffline,
    });
    // END INFINITY LOADING LIST

    // Accordion Content
    const highlightActivePoints =
        filterName.indexOf("highestActiveScores") !== -1 ||
        filterName.indexOf("lowestActiveScores") !== -1;
    const defaultCond =
        filterName === "newCustomers" ||
        filterName === "veteranCustomers" ||
        highlightActivePoints ||
        filterName.indexOf("alphabeticOrder") !== -1;

    const actions = list.map((user) => {
        const { clientUserData: cliUser } = user;

        const { totalGeneralPoints, currPoints } = cliUser;

        const gotTargetPrize = Boolean(totalGeneralPoints !== currPoints);

        const handleSecHeading = () => {
            const {
                hightlightThisInfo,
                infoTitle,
                infoData,
            } = getHighlightFilterData({ filterName, user, defaultCond });

            return (
                <div style={{ marginTop: 45 }}>
                    <p
                        className={`${
                            highlightActivePoints
                                ? "recorded-clients-badge"
                                : ""
                        } text-subtitle text-shadow font-weight-bold m-0 mt-4`}
                        style={{ lineHeight: "19px" }}
                    >
                        {!user.clientUserData.currPoints
                            ? "• 0 Pontos"
                            : ` • ${convertToReal(
                                  user.clientUserData.currPoints
                              )} Pontos`}
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

        const highlightName = filterName.indexOf("alphabeticOrder") !== -1;

        return {
            _id: user._id,
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
            secondaryHeading: handleSecHeading(),
            userData: user,
            needCliPrizes: gotTargetPrize,
            hiddenContent: <PanelHiddenContent data={user} />,
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

    return (
        <Fragment>
            <Totals
                loading={loading}
                allUsersLength={countCliUsers}
                countCliUsersCurrPoints={countCliUsersCurrPoints}
                countCliUsersGeneralPoints={countCliUsersGeneralPoints}
                period={period}
            />
            {listTotal !== 0 || emptyType === "filter" ? (
                showSearch()
            ) : (
                <p className="my-2 font-weight-bold text-purple text-normal text-center">
                    Preparando histórico...
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
                        title="Mostrar filtros"
                        textTransform=" "
                    />
                </section>
            ) : (
                showFilter()
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

function useClearSkip({ runName, filter, period, search, setSkip }) {
    // all new type of update should initilize on the 0 position otherwise it will skip the first docs

    useEffect(() => {
        if (filter || runName || search || period) setSkip(0);
        // eslint-disable-next-line
    }, [runName, search, filter, period]);
}

// HELPERS
function handleParams({ search, filterName, period = "day" }) {
    if (!filterName) return {};
    const { day, week: weekCode, month: monthCode, year } = getFilterDate();

    const defaultVal = {
        role: "cliente",
        limit: 5,
    };

    if (search) return { ...defaultVal, search, filter: "alphabeticOrder" };

    switch (period) {
        case "all":
            return { ...defaultVal, filter: filterName };
        case "day":
            return {
                ...defaultVal,
                filter: filterName,
                period,
                day,
            };
        case "week":
            return {
                ...defaultVal,
                filter: filterName,
                period,
                week: weekCode,
            };
        case "month":
            return {
                ...defaultVal,
                filter: filterName,
                period,
                month: monthCode,
            };
        case "year":
            return {
                ...defaultVal,
                filter: filterName,
                period,
                year,
            };
        default:
            return { ...defaultVal, filter: filterName };
    }
}
// END HELPERS

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/

/* ARCHIVES

useEffect(() => {
    if ((filterName && period) || runName === "RecordedClientsList") {
        setIsFiltering(true);
        setTimeout(() => {
            setIsFiltering(false);
        }, 4000);
    }
}, [filterName, period, runName, search, cleared]);

const handleVisible = () => {
    // if (needEmpty) return true;
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

 */
