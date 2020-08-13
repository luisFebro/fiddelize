// URLs ONLY
// user
export const updateUser = userId => `/api/user/${userId}?noResponse=true`;

// Purchase's History
export const readPurchaseCardsList = userId => `/api/user/list/purchase-history/${userId}`;
export const readPrizes = userId => `/api/user/list/purchase-history/prizes/${userId}`;
export const changePrizeStatus = (cliUserId, statusType) => `/api/user/purchase-history/update-status/${cliUserId}?statusType=${statusType}`; // PUT - +params: newValue, taskId

// Automatic Tasks
export const readTasks = (userId, doneStatus) => `/api/task/read/${userId}?doneStatus=${doneStatus}`; // GET
export const addTask = (userId) => `/api/task/add?userId=${userId}`; // PUT
export const toggleDoneUrl = () => `/api/task/toggle`;  // PUT
export const removeTaskAndExpireCliPrize = () => `/api/task/remove-and-expire`

// Notifications
export const readNotifications = (userId) => `/api/notification/read/${userId}`; // GET

// SMS
export const readContacts = (userId) => `/api/sms/read/contacts?userId=${userId}`;
export const sendSMS = () => `/api/sms/send`; // POST
export const readCredits = (userId) => `/api/sms/credits/read?userId=${userId}`;
