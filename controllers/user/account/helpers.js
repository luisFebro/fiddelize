exports.handleDefaultAccess = ({ appId, dataAcc, pullIt }) => {
    const defaultNewlyElem = { appId, ...pullIt, isDefaultAccess: true };
    if (!dataAcc) return defaultNewlyElem;

    const { accounts } = dataAcc;

    const updatedAccs = accounts.map((acc) => {
        acc.isDefaultAccess = false;
        return acc;
    });

    return [defaultNewlyElem, ...updatedAccs];
};

exports.changeDefaultAccess = ({ accounts, appId }) => {
    if (!accounts) return;

    let defaults = {};

    const updatedAccs = accounts.map((acc) => {
        if (acc.appId === appId) {
            acc.isDefaultAccess = true;
            defaults = {
                defaultUserId: acc.userId,
                defaultRole: acc.role,
                defaultBizId: acc.bizId,
                defaultBizName: acc.bizName,
                defaultBizImg: acc.bizImg,
            };
            return acc;
        }

        acc.isDefaultAccess = false;
        return acc;
    });

    return { ...defaults, accounts: updatedAccs };
};
