const { CLIENT_URL } = require("../../../config");

exports.getMemberJob = (code) => {
    if (code === "vn") return "vendas";
    if (code === "tn") return "atendimento";
    if (code === "cx") return "caixa";
    if (code === "gr") return "gerência";
};

exports.getFinalUrl = ({ user, name, memberJob, userScore }) => {
    const cliAdmin = user.clientAdminData;
    const bizId = user._id;
    const firstName = name;

    const bizName = cliAdmin.bizName; //"You%20Vipp%20Shop"; //addSpace(bizName.cap())
    const logo = cliAdmin.selfBizLogoImg;
    const bc = cliAdmin.selfThemeBackColor;
    const pc = cliAdmin.selfThemePColor;
    //fiddelize=1 for biz team
    const defaultQueryParams = `negocio=${bizName}&id=${bizId}&logo=${logo}&bc=${bc}&pc=${pc}`;

    if (memberJob) {
        return `${CLIENT_URL}/baixe-app/${firstName}?cliente-membro=1&mj=${memberJob}&${defaultQueryParams}`;
    }

    if (userScore) {
        return `${CLIENT_URL}/baixe-app/${firstName}?cliente=1&sc=${userScore}&${defaultQueryParams}`;
    }

    return firstName
        ? `${CLIENT_URL}/baixe-app/${firstName}?cliente=1&${defaultQueryParams}`
        : `${CLIENT_URL}/baixe-app?cliente=1&${defaultQueryParams}`;
};
