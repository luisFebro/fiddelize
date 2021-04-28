import { setMultiVar, store } from "hooks/storage/useVar";
import getFirstName from "utils/string/getFirstName";

// for both indexDB and localstorage in one place
// for both bootup login data and recurring access
export default async function setInitData(role, options = {}) {
    const { initData, dispatch } = options;
    if (!role || !initData || !dispatch)
        return Promise.reject("missing role or initData");

    const payload = getIndexedDbData(role, initData);

    await setMultiVar(payload, store.user);
    // dispatch here used to update all indexDB variables. otherwise, null in the bootup. So it is extremely important to update UI with the new variables in indexedDB
    dispatch({ type: "USER_READ", payload: initData.currUser });

    return "done setting init data";
}

const getIndexCommonData = (initData) => [
    { role: initData.currUser && initData.currUser.role },
    { userId: initData.currUser && initData.currUser.userId },
    { appId: initData.appId },
    { bizId: initData.bizId },
    {
        name: getFirstName(initData.currUser && initData.currUser.name.cap(), {
            addSurname: true,
        }),
    },
    {
        firstName: getFirstName(
            initData.currUser && initData.currUser.name.cap()
        ),
    },
    { sexLetter: initData.currUser && initData.currUser.sexLetter },
    { gender: initData.currUser && initData.currUser.gender },
];

const getDataByRole = (role, initData) => {
    const bizTeam = [
        { rememberAccess: true },
        { primaryAgent: initData.primaryAgent },
        { agentJob: initData.agentJob },
        { redirectPayGatewayLink: initData.redirectPayGatewayLink },
        { uniqueLinkId: initData.uniqueLinkId },
    ];

    const cliAdmin = [
        { rememberAccess: true },
        { linkId: 0 },
        { bizCodeName: initData.bizCodeName },
        { twoLastCpfDigits: initData.twoLastCpfDigits },
        { verifPass: initData.verificationPass },
        { memberJob: initData.memberJob },
    ];

    const cliMember = [
        { rememberAccess: true },
        { linkId: initData.linkId },
        { memberJob: initData.memberJob },
    ];

    const cliUser = [
        { rememberAccess: true },
        { success: true }, // other apps are authenticated on password page.
        { token: initData.token },
        { bizCodeName: initData.bizCodeName },
        { lastPrizeId: initData.currUser && initData.currUser.lastPrizeId },
        { lastPrizeDate: initData.currUser && initData.currUser.lastPrizeDate },
    ];

    const roleLib = {
        "nucleo-equipe": bizTeam,
        "cliente-admin": cliAdmin,
        "cliente-membro": cliMember,
        cliente: cliUser,
    };

    return roleLib[role];
};

function getIndexedDbData(role, initData) {
    const indexCommonData = getIndexCommonData(initData);
    const dataByRole = getDataByRole(role, initData);

    return [...indexCommonData, ...dataByRole];
}
