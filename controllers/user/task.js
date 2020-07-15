const User = require('../../models/user');
const { msgG } = require('../_msgs/globalMsgs');
const findKeyAndAssign = require("../../utils/array/findKeyAndAssign");
const getDataChunk = require("../../utils/array/getDataChunk");

// UTILS
const pickDataByProfile = ({ profileData, role = 'cliente-admin' }) => {

    switch(role) {
        case "cliente":
            return null;
        case "cliente-admin":
            return profileData.clientAdminData.tasks;
        default:
            console.log("smt wrong with pickDataByProfile")
    }
}

const pickObjByRole = ({ role = "cliente-admin", data }) => {
    const handledData = { $each: [data], $position: 0 } // $each needs $push asn precedent operator, otherwise it will fail

    switch(role) {
        case "cliente-admin":
            return { "clientAdminData.tasks": handledData };
        case "cliente":
            return null;
        case "ambos-clientes":
            return null;
        default:
            console.log("smt wrong with pickObjByRole")
    }
}
// END UTILS


// Method: Put
exports.addAutomaticTask = (req, res) => {
    const dataToSend = req.body;
    const userId = req.query.userId;

    if(!userId) return res.status(400).json({msg: "Missing recipient's ID"})

    const obj = pickObjByRole({ data: dataToSend });
    User.findOneAndUpdate({ _id: userId }, { $push: obj }, { new: false })
    .select("clientAdminData.tasks")
    .exec((err, user) => {
        if (err) return res.status(500).json(msgG('error.systemError', err))
        res.json({ msg: `the task was sent`});
    });
}

// Method: Get
exports.readTasks = (req, res) => {
    const { doneStatus, skip, limit = 5 } = req.query;
    const array = pickDataByProfile({ profileData: req.profile });

    const data = array.filter(task => task.done.toString() === doneStatus);
    const dataSize = data.length;
    const dataChunk = getDataChunk(data, { skip, limit })

    res.json({ list: dataChunk, listTotal: dataSize, chunksTotal: Math.ceil(dataSize / limit) });
}

// Method: Put
exports.toggleDone = (req, res) => {
    const { userId, taskId, doneStatus } = req.body;

    User.findById(userId) // LESSON - IMPORTANT: do not use select with SAVE because will delete all other not selected data in the object...
    .exec((err, doc) => {
        if(err) return res.status(500).json(msgG('error.systemError', err));

        let tasks = doc.clientAdminData.tasks;

        let keyValueObj = undefined;
        if(doneStatus === true) keyValueObj = {
            done: doneStatus,
            madeDate: new Date(),
        }

        const newData = findKeyAndAssign({
            objArray: tasks,
            compareProp: '_id', compareValue: taskId,
            targetProp: 'done', targetValue: doneStatus,
            keyValueObj,
        });

        tasks = newData;

        doc.markModified("clientAdminData.tasks");

        doc.save(err => res.json({msg: `The done status was toggled to ${doneStatus ? doneStatus.toString().toUpperCase() : doneStatus}!`}))
    });

}