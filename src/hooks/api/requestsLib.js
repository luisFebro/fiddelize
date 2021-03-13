import { API } from "../../config/api";
// URLs ONLY
// USER
export const readUser = (userId, role, noResponse = true) =>
    `${API}/user/${userId}?noResponse=${noResponse}&thisRole=${role}`;
export const updateUser = (userId, thisRole) =>
    `${API}/user/${userId}?noResponse=true&thisRole=${thisRole}`;
export const removeUser = (userId) => `/api/user/${userId}`;

// client's register
export const readUserList = (cliAdminId) =>
    `${API}/user/list/all?bizId=${cliAdminId}`;
export const readHighestScores = (cliAdminId) =>
    `${API}/user/list/highest-scores?bizId=${cliAdminId}`;
// END USER

// ACCOUNT
export const createInstantApp = () => `${API}/user/instant-app`; // POST
export const readAppList = () => `${API}/user/acc/app-list`; // GET
export const setDefaultAccess = () => `${API}/user/acc/set-default-access`; // POST

// END ACCOUNT

// PURCHASE'S HISTORY
export const readPurchaseCardsList = (userId) =>
    `${API}/user/list/purchase-history/${userId}`;
export const readPrizes = (userId) =>
    `${API}/user/list/purchase-history/prizes/${userId}`;
export const changePrizeStatus = (cliUserId, statusType) =>
    `${API}/user/purchase-history/update-status/${cliUserId}?statusType=${statusType}`; // PUT - +params: newValue, taskId
export const addPurchaseHistory = (userId, role) =>
    `${API}/user/purchase-history/${userId}?thisRole=${role}`; // PUT

// Automatic Tasks
export const readTasks = (userId, doneStatus) =>
    `${API}/task/read/${userId}?doneStatus=${doneStatus}&thisRole=cliente-admin`; // GET
export const addTask = (userId) => `${API}/task/add?userId=${userId}`; // PUT
export const toggleDoneUrl = () => `${API}/task/toggle`; // PUT
export const removeTaskAndExpireCliPrize = () =>
    `${API}/task/remove-and-expire`;

// Notifications
export const readNotifications = (userId) =>
    `${API}/notification/read/${userId}`; // GET

// SMS
export const readContacts = (userId) =>
    `${API}/sms/read/contacts?userId=${userId}`;
export const sendSMS = () => `${API}/sms/send`; // POST
export const readCredits = (userId) =>
    `${API}/sms/credits/read?userId=${userId}`;
export const getGeneralTotals = (userId) =>
    `${API}/sms/history/general-totals?userId=${userId}`;
export const readSMSMainHistory = (userId) =>
    `${API}/sms/history/read-main?userId=${userId}`;
export const readSMSHistoryStatement = (userId, cardId) =>
    `${API}/sms/history/read-statement?userId=${userId}&cardId=${cardId}`;
export const cancelSMS = (userId, cardId) =>
    `${API}/sms/cancel?userId=${userId}&cardId=${cardId}`;
export const readAutoService = (userId) =>
    `${API}/sms/automatic/read?userId=${userId}`;
export const activateAutoService = () => `${API}/sms/automatic/activate`; // POST

// PAY
export const startCheckout = () => `${API}/pay/transparent-checkout/start`; // POST
export const finishCheckout = () => `${API}/pay/transparent-checkout/finish`; // POST
export const readTransactionHistory = () => `${API}/pay/transactions/history`; // GET
export const checkOneClickInvest = (userId) =>
    `${API}/pay/cc/check/one-click-invest?userId=${userId}`; // GET
export const removeOneClickInvest = (userId) =>
    `${API}/pay/cc/remove/one-click-invest?userId=${userId}`; // PUT

// PRO
export const getProData = (userId) =>
    `${API}/pro/pro-member-data?userId=${userId}`; // POST
export const getNextExpiryDate = (userId) =>
    `${API}/pro/service/next-expiry-date?userId=${userId}`; // GET
export const removeServices = (userId) =>
    `${API}/pro/service/remove?userId=${userId}`; // DELETE

// PASSWORD AND AUTH
export const checkPassword = () => `${API}/auth/pswd/check`;
export const getDecryptedToken = () => `${API}/auth/pswd/decrypt-token`;
export const getAuthTk = () => `${API}/auth/pswd/auth-tk`; // POST - directly fetch token on successful login
export const getToken = () => `${API}/auth/pswd/token`;
export const forgotPasswordRequest = () => `${API}/auth/pswd/forgot`;
export const recoverPassword = () => `${API}/auth/pswd/recover`;
export const changePassword = () => `${API}/auth/pswd/change`;
export const createPassword = () => `${API}/auth/pswd/create`;
// export const makeGoogleLogin = () => `${API}/auth/google`; // POST

// TEAM
export const readTeamMemberList = () => `${API}/user/team/list`;
export const readTeamTaskList = () => `${API}/user/team/tasks/list`;
export const readOneMemberTasksList = () =>
    `${API}/user/team/member-history/list`;
export const setTempScoreAndMemberData = () =>
    `${API}/user/team/temp-user-score-member`;
export const getMembersPodium = (bizId) =>
    `${API}/user/team/members/podium?bizId=${bizId}`;

// TEMP SCORE
export const readTempScoreList = (userId) =>
    `${API}/user/cli-user/temp-score/list?userId=${userId}`;
export const setLastScoreAsDone = (userId) =>
    `${API}/user/cli-user/temp-score/set-last-done?userId=${userId}`; // POST
export const encryptLinkScore = () => `${API}/user/cli-user/temp-score/encrypt`; // POST
export const isLinkAllowed = () =>
    `${API}/user/cli-user/temp-score/allowed-link`; // GET

// EMAIL
export const sendEmail = () => `${API}/email/send`;

// REVIEWS
export const getBuyReviewsList = () => `${API}/reviews/list/buy-reviews`;
export const getMainReviewData = (userId) =>
    `${API}/reviews/main-data?userId=${userId}`;
export const getNpsChartData = (userId) =>
    `${API}/reviews/nps-chart?userId=${userId}`;
export const getXpScoreChartData = (userId) =>
    `${API}/reviews/xp-score-chart?userId=${userId}`;

// BIZ FIDDELIZE TEAM
export const readAgentIncomeHistory = () =>
    `${API}/user/biz-fiddelize-team/income/history`;

// cabin fiddelize-cabin
export const getCabinMainData = () => `${API}/admin/fiddelize-cabin/main-data`;
