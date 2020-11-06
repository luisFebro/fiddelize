const { CLIENT_URL } = require("../../../config");

exports.getMemberJob = (code) => {
    if (code === "vn") return "vendas";
    if (code === "tn") return "atendimento";
    if (code === "cx") return "caixa";
    if (code === "gr") return "gerência";
};

exports.getFinalUrl = ({ user, name, memberJob }) => {
    const cliAdmin = user.clientAdminData;
    const bizId = user._id;
    const firstName = name;

    const bizName = cliAdmin.bizName; //"You%20Vipp%20Shop"; //addSpace(bizName.cap())
    const logo = cliAdmin.selfBizLogoImg;
    const bc = cliAdmin.selfThemeBackColor;
    const pc = cliAdmin.selfThemePColor;

    if (memberJob) {
        return `${CLIENT_URL}/baixe-app/${firstName}?negocio=${bizName}&id=${bizId}&cliente=1&logo=${logo}&mj=${memberJob}&bc=${bc}&pc=${pc}`;
    }

    return firstName
        ? `${CLIENT_URL}/baixe-app/${firstName}?negocio=${bizName}&id=${bizId}&cliente=1&logo=${logo}&bc=${bc}&pc=${pc}`
        : `${CLIENT_URL}/baixe-app?negocio=${bizName}&id=${bizId}&cliente=1&logo=${logo}&bc=${bc}&pc=${pc}`;
};
