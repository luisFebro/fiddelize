import { ROOT } from "api/root";
/*
 URLs ONLY
*/
// GENERAL DATA
export const removeUser = (userId) => `${ROOT}/user/${userId}`; // DELETE
export const pushElemToField = () => `${ROOT}/user/field/array/push`; // PUT
export const getUserIdByName = () => `${ROOT}/user/id-by-name`; // GET
export const checkFieldGotValue = () =>
    `${ROOT}/user/field/check-field-got-value`; // POST

// AMURRETO TRADES
export const readTradesHistory = () =>
    `https://amurreto.herokuapp.com/api/altrabot/trades/history`; // GET
export const getTotalResults = () =>
    `https://amurreto.herokuapp.com/api/altrabot/trades/total/results`;
// END AMURRETO TRADES

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
export const decode = () => `${ROOT}/auth/text/decode`; // POST
// export const makeGoogleLogin = () => `${ROOT}/auth/google`; // POST

// CLI-USER
// client's register
export const readAllCliUsers = (cliAdminId) =>
    `${ROOT}/user/list/all?bizId=${cliAdminId}`;
export const readHighestScores = (cliAdminId) =>
    `${ROOT}/user/list/highest-scores?bizId=${cliAdminId}`;

// buy's history
export const readBuyHistory = (userId) =>
    `${ROOT}/user/list/buy-history/${userId}`; // GET
export const readPrizes = (userId) =>
    `${ROOT}/user/list/purchase-history/prizes/${userId}`;

// points and benefits
export const readBenefitCards = () => `${ROOT}/user/cli-user/list/benefits`; // GET
export const benefitCardsAutocomplete = (bizId, { isReceived, limit = 5 }) =>
    `${ROOT}/user/cli-user/list/benefit-cards/autocomplete?bizId=${bizId}&limit=${limit}&isReceived=${isReceived}`; // GET
export const changeBenefit = () => `${ROOT}/user/cli-user/change-benefit`; // PUT
export const addTempPoints = () => `${ROOT}/user/cli-user/temp-points/add`;
export const removeTempPoints = () =>
    `${ROOT}/user/cli-user/temp-points/remove`;
export const addPoints = () => `${ROOT}/user/cli-user/pts/add`; // POST
export const removePoints = () => `${ROOT}/user/cli-user/pts/remove`; // DELETE
export const readLastTempPoints = (userId) =>
    `${ROOT}/user/cli-user/last-temp-points?userId=${userId}`;
export const encryptPointsLink = () =>
    `${ROOT}/user/cli-user/temp-points/encrypt`; // POST
export const isLinkAllowed = () =>
    `${ROOT}/user/cli-user/temp-points/allowed-link`; // GET

// CLI-ADMIN
// sms
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

// pay
export const startCheckout = () => `${ROOT}/pay/transparent-checkout/start`; // POST
export const finishCheckout = () => `${ROOT}/pay/transparent-checkout/finish`; // POST
export const readTransactionHistory = () => `${ROOT}/pay/transactions/history`; // GET
export const checkOneClickInvest = (userId) =>
    `${ROOT}/pay/cc/check/one-click-invest?userId=${userId}`; // GET
export const removeOneClickInvest = (userId) =>
    `${ROOT}/pay/cc/remove/one-click-invest?userId=${userId}`; // PUT

// pro
export const getProData = (userId) =>
    `${ROOT}/pro/pro-member-data?userId=${userId}`; // POST
export const removeServices = (userId) =>
    `${ROOT}/pro/service/remove?userId=${userId}`; // DELETE

// images (logo)
export const uploadImages = (fileName) =>
    `${ROOT}/user/image/upload?fileName=${fileName}`; // POST
export const updateImages = (userId) =>
    `${ROOT}/user/image/update?id=${userId}`; // PUT

// TEAM/CLI-MEMBER
export const readTeamMemberList = () => `${ROOT}/user/team/list`;
export const readTeamTaskList = () => `${ROOT}/user/team/tasks/list`;
export const teamAutocomplete = (bizId, { adminName, memberId, isAdmin }) =>
    `${ROOT}/user/team/autocomplete?bizId=${bizId}&memberId=${memberId}&isAdmin=${isAdmin}&adminName=${adminName}&limit=5`;
export const getMembersPodium = (bizId) =>
    `${ROOT}/user/team/members/podium?bizId=${bizId}`;
export const getSingleMemberPodium = (bizId, memberId) =>
    `${ROOT}/user/team/single-member/podium?bizId=${bizId}&memberId=${memberId}`;

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

// REVIEWS
export const getBuyReviewsList = () => `${ROOT}/reviews/list/buy-reviews`;
export const getMainReviewData = (userId) =>
    `${ROOT}/reviews/main-data?userId=${userId}`;
export const getNpsChartData = (userId) =>
    `${ROOT}/reviews/nps-chart?userId=${userId}`;
export const getXpScoreChartData = (userId) =>
    `${ROOT}/reviews/xp-score-chart?userId=${userId}`;

// EMAIL
export const sendEmail = () => `${ROOT}/email/send`;

// DB
export const readAllDbData = (adminId) =>
    `${ROOT}/database/db-from-models/list/${adminId}`; // GET

// PUSH NOTIFICATIONS
export const subscribePushNotif = () => `${ROOT}/push-notification/subscribe`; // POST
export const readOrUpdateNotifStatus = (action) =>
    `${ROOT}/push-notification/notif-status?action=${action}`; // PUT
export const readUserSubIds = () => `${ROOT}/push-notification/read/sub-ids`; // GET
export const sendPushNotifs = () => `${ROOT}/push-notification/go-everybody`; // POST

// IN-APP NOTIFICATIONS
export const markOneClicked = (userId) =>
    `${ROOT}/notification/mark-one-clicked/${userId}`; // PUT
export const markAllAsClicked = (userId) =>
    `${ROOT}/notification/mark-all-clicked/${userId}`; // PUT
export const markAllAsSeen = (userId) =>
    `${ROOT}/notification/mark-all-seen/${userId}`; // PUT
export const readNotifications = (userId) =>
    `${ROOT}/notification/read/${userId}`; // GET

// ACCOUNT, DOWNLOAD AND URLS
export const createInstantApp = () => `${ROOT}/user/instant-app`; // POST
export const readAppList = () => `${ROOT}/user/acc/app-list`; // GET
export const setDefaultAccess = () => `${ROOT}/user/acc/set-default-access`; // POST
export const getUrlLink = (code) =>
    `${ROOT}/user/redirect/url-link?code=${code}`; // GET

// MISCELLANEOUS
export const countField = (userId, role = "cliente") =>
    `${ROOT}/user/count/field/${userId}?thisRole=${role}`; // PUT
