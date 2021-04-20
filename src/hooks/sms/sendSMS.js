import getAPI, {
    readCredits,
    readAutoService,
    sendSMS as sendThisSMS,
} from "../../utils/promises/getAPI";
import didRunOnce from "../../utils/storage/didRunOnce";
import getFilterDate from "../../utils/dates/getFilterDate";

const filter = getFilterDate();
// import { showSnackbar } from '../../redux/actions/snackbarActions';

export default function sendSMS({
    userId,
    smsId = "", // for automatic only
    serviceType = "confirmedChall",
    contactList,
    customMsg,
    isAutomatic = true,
    trigger = true,
    needCheckCredits = false,
    // txtPending,
}) {
    const promiseSMS = async (resolve, reject) => {
        try {
            let triggerInner = false;
            let msg;
            let serviceId;
            let credits;

            if (isAutomatic || needCheckCredits) {
                const { data } = await getAPI({ url: readCredits(userId) });
                if (!data) return resolve("No credits");
                credits = data;
            }

            if (isAutomatic) {
                const alreadySent = await didRunOnce(
                    `autoSMS_${serviceType}_${(smsId = "")}` // for automatic only
                );
                if (alreadySent) return resolve("Already sent");

                const { data: doneServices } = await getAPI({
                    url: readAutoService(userId),
                    needAuth: true,
                });

                const foundService = doneServices.find(
                    (opt) => opt.service === serviceType
                );
                const isServiceOn = foundService && foundService.active;

                if (isServiceOn) {
                    msg = customMsg || foundService.msg;
                    serviceId = foundService.serviceId;
                    triggerInner = true;
                }
            }

            const handleTrigger = () => {
                if (!isAutomatic && needCheckCredits)
                    return trigger && credits >= 1;
                if (!isAutomatic) return trigger;
                return triggerInner && credits >= 1;
            };

            const response = await getAPI({
                method: "post",
                url: sendThisSMS(),
                timeout: 15000,
                body: {
                    userId,
                    contactList,
                    msg,
                    serviceId,
                    isAutomatic,
                    filter,
                },
                needAuth: true,
                trigger: handleTrigger(),
            });

            resolve(response);
        } catch (e) {
            reject(e);
        }
    };

    return new Promise(promiseSMS);
}
