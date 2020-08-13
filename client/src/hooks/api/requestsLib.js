// URLs ONLY

// Purchase's History
export const readPrizes = userId => `/api/user/list/purchase-history/prizes/${userId}`;
export const changePrizeStatus = (cliUserId, statusType) => `/api/user/purchase-history/update-status/${cliUserId}?statusType=${statusType}`; // PUT - +params: newValue, taskId

// Automatic Tasks
export const readTasks = (userId, doneStatus) => `/api/task/read/${userId}?doneStatus=${doneStatus}`; // GET
export const addTask = (userId) => `/api/task/add?userId=${userId}`; // PUT
export const toggleDoneUrl = () => `/api/task/toggle`;  // PUT

