const User = require("../models/user");
const TTL = require("../models/TTL");
const addMinutes = require("date-fns/addMinutes");
const isBefore = require("date-fns/isBefore");

// TIME-TO-LIVE
/*
TTL indexes are special single-field indexes that MongoDB can use to automatically remove documents from a collection after a certain amount of time or at a specific clock time.
USEFUL FOR setting a expiry time for email tokens, user session, etc
 */

async function createTTL(target, options = {}) {
    const { userId, expireAt, requestId } = options;

    // LESSON: you need to have _id to create a new doc. Otherwise, it will fail...
    const newTTL = new TTL({
        target,
        expireAt: addMinutes(new Date(), expireAt),
        requestId,
        userId,
    });

    await newTTL.save();
    return true;
}

// Check if the document is still valid, not expired.
async function checkTTL(target, options = {}) {
    const { requestId, expireAt } = options;

    const now = new Date();
    const isExpired = !isBefore(new Date(now), new Date(expireAt));

    if (isExpired) {
        await TTL.findOneAndUpdate({ requestId }, { isExpired: true });
        return false;
    }

    return true;
}

async function getTTLResult(userId, options = {}) {
    const { target = "emailToken", expireAt = 60, requestId } = options;

    const ttlDoc = await TTL.findOne({ requestId });

    if (ttlDoc && ttlDoc.isExpired === true) return false;

    if (ttlDoc) {
        const status = await checkTTL(target, {
            requestId: ttlDoc.requestId,
            expireAt: ttlDoc.expireAt,
        });
        if (!status) {
            return false;
        } else {
            return true;
        }
    } else {
        return await createTTL(target, { userId, expireAt, requestId });
    }
}

module.exports = getTTLResult;

/* ARCHIVES
const setTTLUserRef = async (userId, options = {}) => {
    const { target = "emailToken", ttlId, requestId } = options;
    const obj = {
        requestId,
        ttlId,
    }

    return await User.findByIdAndUpdate(userId, { $push: { [`clientAdminData.TTL.${target}`]: obj } })
}

async function removeTTLUserRef(userId, options = {}) {
    const { target } = options;

    await setTTLUserRef(userId, { target, remove: true })

    return false;
}

const doc = await User.findById(userId)
    .select(`clientAdminData.TTL.${target} -_id`)
    .populate(`clientAdminData.TTL.${target}`)

 */
