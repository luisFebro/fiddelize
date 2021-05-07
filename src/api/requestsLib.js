import { ROOT } from "api/root";
/*
 URLs ONLY
*/

// AUTH AND PASSWORD
export const register = () => `${ROOT}/auth/register`; // POST
export const login = () => `${ROOT}/auth/login`; // POST
export const loadDataInit = () => `${ROOT}/auth/load-user/init`; // POST
export const checkValidSession = () => `${ROOT}/auth/session-check`;
export const checkPassword = () => `${ROOT}/auth/pswd/check`;
export const createTk = () => `${ROOT}/auth/pswd/create-tk`; // POST - directly fetch token on successful login
export const forgotPasswordRequest = () => `${ROOT}/auth/pswd/forgot`;
export const recoverPassword = () => `${ROOT}/auth/pswd/recover`;
export const changePassword = () => `${ROOT}/auth/pswd/change`;
export const createPassword = () => `${ROOT}/auth/pswd/create`;
export const readVerificationPass = (bizId) =>
    `${ROOT}/admin/verification-pass/${bizId}`; // GET
export const checkVerificationPass = () => `${ROOT}/admin/verification-pass`; // POST
// export const makeGoogleLogin = () => `${ROOT}/auth/google`; // POST

// USER
export const readUser = (userId, role, noResponse = true) =>
    `${ROOT}/user/${userId}?noResponse=${noResponse}&thisRole=${role}`;
export const updateUser = (userId, role, noResponse = true) =>
    `${ROOT}/user/${userId}?noResponse=${noResponse}true&thisRole=${role}`;
export const removeUser = (userId) => `/api/user/${userId}`;

// client's register
export const readUserList = (cliAdminId) =>
    `${ROOT}/user/list/all?bizId=${cliAdminId}`;
export const readHighestScores = (cliAdminId) =>
    `${ROOT}/user/list/highest-scores?bizId=${cliAdminId}`;
// END USER

// ACCOUNT
export const createInstantApp = () => `${ROOT}/user/instant-app`; // POST
export const readAppList = () => `${ROOT}/user/acc/app-list`; // GET
export const setDefaultAccess = () => `${ROOT}/user/acc/set-default-access`; // POST

// END ACCOUNT

// PURCHASE'S HISTORY
export const readPurchaseCardsList = (userId) =>
    `${ROOT}/user/list/purchase-history/${userId}`;
export const readPrizes = (userId) =>
    `${ROOT}/user/list/purchase-history/prizes/${userId}`;
export const changePrizeStatus = (cliUserId, statusType) =>
    `${ROOT}/user/purchase-history/update-status/${cliUserId}?statusType=${statusType}`; // PUT - +params: newValue, taskId
export const addPurchaseHistory = (userId, role) =>
    `${ROOT}/user/purchase-history/${userId}?thisRole=${role}`; // PUT

// Automatic Tasks
export const readTasks = (userId, doneStatus) =>
    `${ROOT}/task/read/${userId}?doneStatus=${doneStatus}&thisRole=cliente-admin`; // GET
export const addTask = (userId) => `${ROOT}/task/add?userId=${userId}`; // PUT
export const toggleDoneUrl = () => `${ROOT}/task/toggle`; // PUT
export const removeTaskAndExpireCliPrize = () =>
    `${ROOT}/task/remove-and-expire`;

// Notifications
export const readNotifications = (userId) =>
    `${ROOT}/notification/read/${userId}`; // GET

export const setNotifAuthor = () => `${ROOT}/notification/set-notif-author`; // POST
// SMS
export const readContacts = (userId) =>
    `${ROOT}/sms/read/contacts?userId=${userId}`;
export const sendSMS = () => `${ROOT}/sms/send`; // POST
export const readCredits = (userId) =>
    `${ROOT}/sms/credits/read?userId=${userId}`;
export const getGeneralTotals = (userId) =>
    `${ROOT}/sms/history/general-totals?userId=${userId}`;
export const readSMSMainHistory = (userId) =>
    `${ROOT}/sms/history/read-main?userId=${userId}`;
export const readSMSHistoryStatement = (userId, cardId) =>
    `${ROOT}/sms/history/read-statement?userId=${userId}&cardId=${cardId}`;
export const cancelSMS = (userId, cardId) =>
    `${ROOT}/sms/cancel?userId=${userId}&cardId=${cardId}`;
export const readAutoService = (userId) =>
    `${ROOT}/sms/automatic/read?userId=${userId}`;
export const activateAutoService = () => `${ROOT}/sms/automatic/activate`; // POST

// PAY
export const startCheckout = () => `${ROOT}/pay/transparent-checkout/start`; // POST
export const finishCheckout = () => `${ROOT}/pay/transparent-checkout/finish`; // POST
export const readTransactionHistory = () => `${ROOT}/pay/transactions/history`; // GET
export const checkOneClickInvest = (userId) =>
    `${ROOT}/pay/cc/check/one-click-invest?userId=${userId}`; // GET
export const removeOneClickInvest = (userId) =>
    `${ROOT}/pay/cc/remove/one-click-invest?userId=${userId}`; // PUT

// PRO
export const getProData = (userId) =>
    `${ROOT}/pro/pro-member-data?userId=${userId}`; // POST
export const removeServices = (userId) =>
    `${ROOT}/pro/service/remove?userId=${userId}`; // DELETE

// TEAM
export const readTeamMemberList = () => `${ROOT}/user/team/list`;
export const readTeamTaskList = () => `${ROOT}/user/team/tasks/list`;
export const readOneMemberTasksList = () =>
    `${ROOT}/user/team/member-history/list`;
export const setTempPointsAndMemberData = () =>
    `${ROOT}/user/team/temp-user-score-member`;
export const getMembersPodium = (bizId) =>
    `${ROOT}/user/team/members/podium?bizId=${bizId}`;

// TEMP SCORE
export const readTempPointsList = (userId) =>
    `${ROOT}/user/cli-user/temp-score/list?userId=${userId}`;
export const setLastPointsAsDone = (userId) =>
    `${ROOT}/user/cli-user/temp-score/set-last-done?userId=${userId}`; // POST
export const encryptLinkScore = () =>
    `${ROOT}/user/cli-user/temp-score/encrypt`; // POST
export const isLinkAllowed = () =>
    `${ROOT}/user/cli-user/temp-score/allowed-link`; // GET

// EMAIL
export const sendEmail = () => `${ROOT}/email/send`;

// REVIEWS
export const getBuyReviewsList = () => `${ROOT}/reviews/list/buy-reviews`;
export const getMainReviewData = (userId) =>
    `${ROOT}/reviews/main-data?userId=${userId}`;
export const getNpsChartData = (userId) =>
    `${ROOT}/reviews/nps-chart?userId=${userId}`;
export const getXpScoreChartData = (userId) =>
    `${ROOT}/reviews/xp-score-chart?userId=${userId}`;

// BIZ FIDDELIZE TEAM
export const readAgentIncomeHistory = () =>
    `${ROOT}/user/biz-fiddelize-team/income/history`;
// cabin fiddelize-cabin
export const getCabinMainData = () => `${ROOT}/admin/fiddelize-cabin/main-data`;
export const getAppTotals = () => `${ROOT}/admin/fiddelize-cabin/app-totals`;
export const getXpReviewList = () => `${ROOT}/admin/fiddelize-cabin/xp-reviews`;
// finance
export const getFiddelizeRevenueHistory = () =>
    `${ROOT}/admin/fiddelize-cabin/revenue-history`;
export const convertCurrency = () => `${ROOT}/admin/fiddelize-cabin/curr-conv`;
export const readFiddelizeCosts = () =>
    `${ROOT}/admin/fiddelize-cabin/read-costs`;
export const addFiddelizeCosts = () =>
    `${ROOT}/admin/fiddelize-cabin/add-costs`;
// personal finance usage
export const readFinanceTransactions = () =>
    `${ROOT}/admin/finance/transaction-history`; // GET
export const addFinanceTransaction = () =>
    `${ROOT}/admin/finance/add-transaction`; // POST

// PUSH NOTIFICATIONS
export const subscribePushNotif = () => `${ROOT}/push-notification/subscribe`; // POST
export const readOrUpdateNotifStatus = (action) =>
    `${ROOT}/push-notification/notif-status?action=${action}`; // PUT
export const readUserSubIds = () => `${ROOT}/push-notification/read/sub-ids`; // GET
export const sendPushNotifs = () => `${ROOT}/push-notification/go-everybody`; // POST

// DB
export const readAllDbData = (adminId) =>
    `${ROOT}/database/db-from-models/list/${adminId}`; // GET
