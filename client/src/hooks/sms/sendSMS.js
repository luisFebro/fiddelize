import getAPI, {
    readCredits,
    readAutoService,
    sendSMS as sendThisSMS,
} from '../../utils/promises/getAPI';
import didRunOnce from '../../utils/storage/didRunOnce';

export default function sendSMS({
    userId,
    smsId = "", // for automatic only
    serviceType = "confirmedChall",
    contactList,
    dispatch,
    customMsg,
    isAutomatic = true,
}) {
    const promiseAutoSMS = async (resolve, reject) => {
        try {
            const alreadySent = await didRunOnce(`autoSMS_${serviceType}_${smsId = ""} // for automatic only`)
            if(alreadySent) return resolve("Already sent");

            const { data: credits } = await getAPI({ url: readCredits(userId) })
            if(!credits) return resolve("No credits");

            const { data: doneServices } = await getAPI({ url: readAutoService(userId), needAuth: true })

            const foundService = doneServices.find(opt => opt.service === serviceType);
            const isServiceOn = foundService && foundService.active;

            let trigger = false;
            let msg;
            let serviceId;
            if(isServiceOn) {
                msg = customMsg ? customMsg : foundService.msg;
                serviceId = foundService.serviceId;
                trigger = true;
            }

            const response = await getAPI({
                method: 'post',
                url: sendThisSMS(),
                timeout: 15000,
                body: { userId, contactList, msg, serviceId, isAutomatic },
                needAuth: true,
                trigger: trigger && (credits >= 1),
            })

            resolve(response);
        } catch(e) {
            reject(e);
        }
    }

    return new Promise(promiseAutoSMS);
}