import { Fragment } from "react";
import { calendar } from "utils/dates/dateFns";
import gotArrayThisItem from "utils/arrays/gotArrayThisItem";
import convertToReal from "utils/numbers/convertToReal";

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

export default function getHighlightFilterData({
    filterName,
    user,
    defaultCond,
}) {
    const needHighlight = gotArrayThisItem(activeArray, filterName);
    let infoTitle;
    let infoData;

    if (defaultCond) {
        infoTitle = "• Cadastro feito:";
        infoData = getEachFilterData("newCustomers", { user });
    }

    if (filterName === "lastPurchases" || filterName === "firstPurchases") {
        infoTitle = "• Última compra:";
        infoData = getEachFilterData("lastPurchases", { user });
    }

    if (filterName === "birthdayCustomers") {
        infoTitle = "• Aniversário em:";
        infoData = getEachFilterData("birthdayCustomers", { user });
    }

    if (
        filterName === "buyMoreCustomers" ||
        filterName === "buyLessCustomers"
    ) {
        infoTitle = "• Já comprou:";
        infoData = getEachFilterData("buyMoreCustomers", { user });
    }

    if (
        filterName === "highestSinglePurchases" ||
        filterName === "lowestSinglePurchases"
    ) {
        infoTitle = `• ${
            filterName === "lowestSinglePurchases" ? "Menor" : "Maior"
        } Compra:`;
        infoData = getEachFilterData("highestSinglePurchases", { user });
    }

    return {
        hightlightThisInfo: needHighlight,
        infoTitle,
        infoData,
    };
}

// HELPERS
function getEachFilterData(target, options = {}) {
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
        const condition = user && user.filterLastPurchases;
        const value = condition && calendar(user.filterLastPurchases);
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
        const condition = user;
        const value = convertToReal(user && user.filterSinglePurchases);
        const emptyMsg = "R$ 0.00";
        return getElemMaker(condition, `R$ ${value}`, emptyMsg, true);
    }

    return null;
}
// END HELPERS
