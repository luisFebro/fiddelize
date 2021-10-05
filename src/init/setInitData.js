import { setVars } from "init/var";
import getItems, { setItems } from "init/lStorage";

// for both indexDB and localstorage in one place
// also for bootup Login.js data and recurring access with loadUserInit rest API
export default async function setInitData(data, options = {}) {
    const { uify } = options;
    if (!uify) return Promise.reject("missing role, uify or data");

    // if got user colors, do not set default. Otherwise default colors will be set wrongly when logout
    const [themePColor] = getItems("bizData", ["themePColor"]);

    // DEFAULT DATA TO BE SET WHEN THERE IS NO DATA IN INIT TO AVOID UNDEFINED ERRORS OR BAD CONFIG
    if (!data && !themePColor) return await setDefaultData(uify);
    if (!data) return null;

    const { role } = data.currUser;

    // update app's UI
    uify(["bizData", data.bizData]);
    uify(["currUser", data.currUser]);

    await Promise.all([setIndexedDbData(role, data), setLstorageData(data)]);
    // dispatch here used to update all indexDB variables. otherwise, null in the bootup. So it is extremely important to update UI with the new variables in indexedDB

    return "done setting init data";
}

const getIndexCommonData = (initData) => ({
    ...initData.currUser,
    appId: initData.appId,
});

const getDataByRole = (role, initData) => {
    const bizTeam = {
        rememberAccess: true,
        primaryAgent: initData.primaryAgent,
        agentJob: initData.agentJob,
        redirectPayGatewayLink: initData.redirectPayGatewayLink,
        uniqueLinkId: initData.uniqueLinkId,
    };

    const cliAdmin = {
        rememberAccess: true,
        linkId: 0,
        twoLastCpfDigits: initData.twoLastCpfDigits,
        verifPass: initData.verificationPass,
        memberJob: initData.memberJob,
    };

    const cliMember = {
        rememberAccess: true,
        linkId: initData.linkId || initData.currUser.linkId,
        memberJob: initData.memberJob || initData.currUser.memberJob,
    };

    const cliUser = {
        rememberAccess: true,
        success: true, // other apps are authenticated on password page.
    };

    const roleLib = {
        "nucleo-equipe": bizTeam,
        "cliente-admin": cliAdmin,
        "cliente-membro": cliMember,
        cliente: cliUser,
    };

    return roleLib[role];
};

async function setIndexedDbData(role, initData) {
    const indexCommonData = getIndexCommonData(initData);
    const dataByRole = getDataByRole(role, initData);

    const indexedPayload = {
        ...indexCommonData,
        ...dataByRole,
    };

    return await setVars(indexedPayload, "user");
}

// LOCAL STORAGE
async function setLstorageData(initData) {
    const run = (resolve, reject) => {
        if (!initData) reject("no initData passed as argument");

        setItems("bizData", initData.bizData);
        setItems("currUser", initData.currUser);

        resolve("done!");
    };

    return new Promise(run);
}
// END LOCALSTORAGE

// HELPERS
async function setDefaultData(uify) {
    const defaultBizData = {
        themePColor: "default",
        themeSColor: "default",
        themeBackColor: "default",
    };

    const defaultGame = {
        targetPrize: {},
        discountBack: {},
        raffleTicket: {},
    };

    const defaultCurrUser = {
        adminGame: {
            ...defaultGame,
        },
        userGame: {
            currGame: "",
            ...defaultGame,
        },
    };

    setItems("currUser", defaultCurrUser);
    setItems("bizData", defaultBizData);

    uify(["bizData", defaultBizData]);
    uify(["currUser", defaultCurrUser]);
    return Promise.resolve("default init values set");
}

// END HELPERS
