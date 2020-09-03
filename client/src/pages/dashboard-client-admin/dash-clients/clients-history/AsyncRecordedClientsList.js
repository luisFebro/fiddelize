import React, { Fragment, useEffect, useState, useContext } from "react";
import { calendar } from "../../../../utils/dates/dateFns";
import parse from "html-react-parser";
import RegisteredClientsAccordion from "./accordion/RegisteredClientsAccordion";
import PanelHiddenContent from "./card-hidden-content/PanelHiddenContent";
import convertToReal from "../../../../utils/numbers/convertToReal";
import { useStoreDispatch } from "easy-peasy";
import { updateUser } from "../../../../redux/actions/userActions";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import Title from "../../../../components/Title";
import {
  useAppSystem,
  useProfile,
  useClientAdmin,
} from "../../../../hooks/useRoleData";
import useAPIList, {
  readUserList,
  getTrigger,
  getUniqueId,
} from "../../../../hooks/api/useAPIList";
import { useRunComp } from "../../../../hooks/useRunComp";
import useElemDetection, {
  checkDetectedElem,
} from "../../../../hooks/api/useElemDetection";
import extractStrData from "../../../../utils/string/extractStrData";
import { Load } from "../../../../components/code-splitting/LoadableComp";
import RegisterPanelBtn from "./register-panel-btn/RegisterPanelBtn";
import useElemShowOnScroll from "../../../../hooks/scroll/useElemShowOnScroll";
import getFirstName from "../../../../utils/string/getFirstName";
import "./_RecordedClientsList.scss";
import gotArrayThisItem from "../../../../utils/arrays/gotArrayThisItem";
// import ClientsSearch from './search/ClientsSearch';

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
          className={`${size ? "text-normal" : "text-small"} font-weight-bold`}
        >
          {emptyMsg}
        </span>
      ) : (
        <span
          className={`${size ? "text-normal" : "text-small"} font-weight-bold`}
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
    const value = condition && calendar(user.clientUserData.filterLastPurchase);
    const emptyMsg = "Sem data registrada.";
    return getElemMaker(condition, value, emptyMsg);
  }

  if (target === "birthdayCustomers") {
    const condition = user.clientUserData && user.clientUserData.filterBirthday;
    const value = condition && user.birthday;
    const emptyMsg = "Sem data de aniversário.";
    return getElemMaker(condition, value, emptyMsg);
  }

  if (target === "buyMoreCustomers") {
    const condition =
      user.clientUserData && user.clientUserData.totalGeneralScore;
    const value = convertToReal(
      condition && user.clientUserData.totalGeneralScore
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

export default function AsyncRecordedClientsList() {
  const [skip, setSkip] = useState(0);
  const { businessId } = useAppSystem();
  const { name } = useProfile();
  const { bizPlan } = useClientAdmin();

  const dispatch = useStoreDispatch();

  const showCTA = useElemShowOnScroll("#showNewCTA");

  const [data, setData] = useState({
    totalCliUserScores: 0,
    totalActiveScores: 0,
  });
  const { totalCliUserScores, totalActiveScores } = data;
  const [filter, setFilter] = useState({
    filterName: "newCustomers",
    period: "all",
  });
  console.log("filterName", filter.filterName);

  const { filterName, period, filterName2 } = filter;

  const handleSelectedFilter = (name) => {
    setSkip(0);
    setFilter({ ...filter, filterName: name.selected });
  };

  // update current amount of accumulative and active scores from all cli-users of which cli-admin.
  // this is necessary so that we can have variables to gather these numbers sincedatabase just process them on the fly
  // useful for central admin to know the general scores from all cli-admins
  useEffect(() => {
    const objToSend = {
      "clientAdminData.totalClientUserScores": totalCliUserScores,
      "clientAdminData.totalActiveScores": totalActiveScores,
    };
    updateUser(dispatch, objToSend, businessId);
  }, [totalCliUserScores, totalActiveScores]);

  const params = { role: "cliente", filter: filterName };

  const { runName } = useRunComp();
  const trigger = getTrigger(runName, "RecordedClientsList", {
    cond2: filterName,
  });

  const {
    list,
    content,
    loading,
    ShowLoadingSkeleton,
    error,
    ShowError,
    needEmptyIllustra,
    hasMore,
    isOffline,
    listTotal,
    ShowOverMsg,
  } = useAPIList({
    url: readUserList(businessId),
    skip,
    params,
    trigger,
    listName: "recordedClientsList",
  });
  const detectedCard = useElemDetection({
    loading,
    hasMore,
    setSkip,
    isOffline,
  });

  useEffect(() => {
    if (content) {
      const { totalCliUserScores, totalActiveScores } = extractStrData(content);
      setData({ ...data, totalCliUserScores, totalActiveScores });
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

        if (filterName === "lastPurchases" || filterName === "firstPurchases") {
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

      const { hightlightThisInfo, infoTitle, infoData } = getHighlightInfo(
        filterName
      );

      return (
        <div style={{ marginTop: 45 }}>
          <p
            className={`${
              highlightActiveScore ? "recorded-clients-badge" : ""
            } text-subtitle text-shadow font-weight-bold m-0 mt-4`}
            style={{ lineHeight: "19px" }}
          >
            {!user.clientUserData.currScore
              ? "• 0 Pontos"
              : ` • ${convertToReal(user.clientUserData.currScore)} Pontos`}
            {Boolean(user.clientUserData.totalPurchasePrize) && (
              <Fragment>
                <br />
                <span className="text-small font-weight-bold">
                  (Desafio Atual N.º{" "}
                  {user.clientUserData.totalPurchasePrize + 1})
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
      if (filterName === "birthdayCustomers") {
        return cliUser.filterBirthday ? true : false;
      }
      if (filterName === "highestSinglePurchases") {
        return cliUser.filterHighestPurchase ? true : false;
      }
      if (filterName === "buyMoreCustomers") {
        return cliUser.totalGeneralScore ? true : false;
      }
      if (filterName === "lastPurchases") {
        return cliUser.filterLastPurchase ? true : false;
      }
      if (defaultCond) {
        return true;
      }
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
        <PanelHiddenContent data={user} needBadgeForTestMode={isTestMode} />
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
        needToggleButton={true}
      />
    </section>
  );
  //End Accordion Content

  const showFixedCTA = () =>
    showCTA && (
      <section
        className="animated fadeInUp"
        style={{ position: "fixed", bottom: "10px", right: "10px" }}
      >
        <RegisterPanelBtn title="Novo Cadastro" size="medium" />
      </section>
    );

  const needFreeAlert = Boolean(listTotal >= 7 && bizPlan === "gratis");
  return (
    <Fragment>
      <Title
        title="&#187; Histórico de Cadastro"
        color="var(--themeP)"
        margin="my-4"
      />
      {/*<ClientsSearch />*/}
      <Fragment>
        {needEmptyIllustra ? (
          <AsyncShowIllustra />
        ) : (
          <Fragment>
            <Filters
              listTotal={listTotal}
              loading={loading}
              handleSelectedFilter={handleSelectedFilter}
            />
            {showAccordion()}
            {loading && <ShowLoadingSkeleton size="large" />}
            {error && <ShowError />}
            <ShowOverMsg />
            {needFreeAlert && <AsyncFreeAccountsLimitMsg />}
            {showFixedCTA()}
          </Fragment>
        )}
      </Fragment>
    </Fragment>
  );
}

/* COMMENTS
n1: <span> does not work with alignments and lineheight, only <p> elemnets...
*/
