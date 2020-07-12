// URLs ONLY

// Purchase's History
export const readPrizes = userId => `/api/user/list/purchase-history/prizes/${userId}`;

// Automatic Tasks
export const readTasks = (userId, doneStatus) => `/api/task/read/${userId}?doneStatus=${doneStatus}`;
export const addTask = (userId) => `/api/task/add?userId=${userId}`;
export const toggleDoneUrl = () => `/api/task/toggle`;
