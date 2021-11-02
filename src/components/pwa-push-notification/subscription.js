import getAPI, { subscribePushNotif } from "api";
import showToast from "components/toasts";
import getVar, { setVar } from "init/var";
import isSmallScreen from "utils/isSmallScreen";
import isThisApp from "utils/window/isThisApp";
import { renewSubscription, treatSubData } from "./scriptsUtils";

const convertedVapidKey = urlBase64ToUint8Array(
    process.env.REACT_APP_PUBLIC_PUSH_NOTIF_KEY
);

const isApp = isThisApp();
const isEvenSmall = isSmallScreen(450);
const deviceType = isApp || isEvenSmall ? "mobile" : "desktop";

export default async function subscribeUser({ role, userId }) {
    // n1
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        // Service Worker isn't supported on this browser, disable or hide UI.
        // Push isn't supported on this browser, disable or hide UI.
        return showToast("Navegador sem suporte a notificações.", {
            type: "error",
        });
    }

    // Lesson: if no response from here, it means there's no service worker installed in the browser.
    const registration = await navigator.serviceWorker.ready;

    const newSubscription = await registration.pushManager.subscribe({
        applicationServerKey: convertedVapidKey, // n2
        userVisibleOnly: true,
    });

    const params = { role, userId, deviceType };

    await Promise.all([
        sendSubscription(newSubscription, params),
        setVar({ lastPushSub: JSON.stringify(newSubscription) }),
    ]);
    return "ok";
}

async function sendSubscription(subscription, params = {}) {
    // n1
    return await getAPI({
        method: "post",
        url: subscribePushNotif(),
        body: subscription,
        params, // role, userId, deviceType
    });
}

// this method make sure push sub is valid and remove any expiration
// unfortunately, this method if the user suddently switch and interrupt the method can change the sub and not save the reference disabling notifications
// For now, it is okay not update since browsers tend not having expiring date, but for future attempts: a) try to update in a very steady page where the user probably won't make any blantly switch pages; b) or insert that in notificaton settings directly.
export async function updateExpiredPushSub() {
    const registration = await navigator.serviceWorker.ready;
    if (!registration) return Promise.reject("SW not available");

    const currSubData = await registration.pushManager.getSubscription();
    const currSub = treatSubData(currSubData);

    const oldSub = JSON.parse(await getVar("lastPushSub"));
    const oldEndpoint = oldSub && oldSub.endpoint;
    // chrome by default is null, but others can have a timer
    const MILI_5_DAYS = 432000000;
    const gotExpTimerAndWithin5days =
        currSub.expirationTime &&
        Date.now() > currSub.expirationTime - MILI_5_DAYS;
    if (gotExpTimerAndWithin5days)
        return await handleNewRenewal({
            currSubData,
            registration,
            oldEndpoint,
        });

    // in case the user clear cache, or prior users with active sub or just make sure users got a local register to compare with curr one.
    const isSubNotLocalRegister = currSub && !oldSub;

    if (isSubNotLocalRegister)
        return setVar({ lastPushSub: JSON.stringify(currSub) });
    if (!oldSub || !currSub)
        return Promise.reject("user is not subscribed to push");

    // const isSamePushSub = currSub.endpoint === oldEndpoint;
    // if (isSamePushSub) return Promise.reject("valid sub still on");

    await handleNewRenewal({ currSubData, registration, oldEndpoint }).catch(
        console.log
    );

    return "done renewal";
}

async function handleNewRenewal({ currSubData, registration, oldEndpoint }) {
    // returns true if successfully unsubscribe user
    // if we do not unsubscribe, the newSub will be generated the same prior sub data
    if (currSubData) await currSubData.unsubscribe();

    const newSub = await registration.pushManager.subscribe({
        applicationServerKey: convertedVapidKey, // n2
        userVisibleOnly: true,
    });

    await Promise.all([
        renewSubscription({ oldEndpoint, newSub, isBrowser: true }).catch(
            console.log
        ),
        setVar({ lastPushSub: JSON.stringify(newSub) }),
    ]);

    return "new push sub was renewed";
}

// HELPERS
function urlBase64ToUint8Array(base64String) {
    if (!base64String) {
        console.log(
            "base64String is not passed or is in an invalid format other than string. Check if your PUBLIC_VAPID_KEY is declared correctly both in dev and production env."
        );
        return null;
    }

    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    // eslint-disable-next-line
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
// END HELPERS

/* COMMENTS
n1: A PushSubscription contains all the information we need to send a push message to that user. You can "kind of" think of this as an ID for that user's device.

n2: The application server keys, also known as VAPID keys, are unique to your server. They allow a push service to know which application server subscribed a user and ensure that it's the same server triggering the push messages to that user.
e.g payload:
[4, 105, 76, 14, 172, 236, 207, 119, 162, 60, 51, 209, 238, 215, 57, 158, 150, 152, 206, 1, 2, 192, 38, 117, 140, 64, 140, 248, 53, 255, 101, 11, 252, 52, 38, 255, 19, 248, 64, 156, 186, 68, 73, 193, 91, 194, 228, 142, 38, 209, 68, 28, 50, 236, 91, 162, 84, 241, 243, 229, 88, 123, 213, 3, 128]

n3: example first payload received:
{"endpoint":"https://fcm.googleapis.com/fcm/send/ffU2enuOhCE:APA91bGkYoa4OOUYK7oh33iHav36wDkvqeH2cjoTY2qk_88hPjJdzA15D62t25c2MmY9Lv7EYizGKHGCqCB4eWEWbvJ9GyC2OK2xqJ_V0Rr4uvG2fH0shS8cJfrOFg5_WS8k08E2s285","expirationTime":null,"keys":{"p256dh":"BG4T7_CZ76nK3inw1t8WexxoGLECPdZdc7Xp5-BDKpGlmqkfLWPyyN_zc56R9UrDigs9ijK2dSu_gszHCsc9_TU","auth":"rr1brQJN0Qr0_bp_ZNQNfQ"}}
*/

/* ARCHIVES
// LESSON: this is handled by pushsubscriptionchange event handler in service-worker
// for now, this did not work during test. So probably will create another subscription here and save it.
const existedSubscription = await registration.pushManager.getSubscription();

const gotAlreadySubscripted = existedSubscription !== null;
if (gotAlreadySubscripted) {
    sendSubscription(existedSubscription, { role, userId, deviceType });
    return "ok";
}

*/
