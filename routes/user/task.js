const express = require("express");
const router = express.Router();

const {
    readTasks,
    addAutomaticTask,
    toggleDone,
    removeTask,
} = require("../../controllers/user/task");

const { mwIsAuth } = require("../../controllers/auth");

const {
    mwUserId
} = require("../../controllers/user");

// @ routes api/task/...
router.get('/read/:userId', mwIsAuth, readTasks);
router.put('/add', addAutomaticTask); // mwIsAuth
router.put('/toggle', toggleDone); // mwIsAuth
router.put('/remove-and-expire', removeTask);

router.param("userId", mwUserId);

module.exports = router;