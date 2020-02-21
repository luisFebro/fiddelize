const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = "user-backups";

const data = {
    subject: String,
    backup: {
        type: Object
    }
}

const backupSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('BackupUser', backupSchema, collectionName);



