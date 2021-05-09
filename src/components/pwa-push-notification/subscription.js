import getAPI, { subscribePushNotif } from "api";
// import { setVar } from "init/var";

const convertedVapidKey = urlBase64ToUint8Array(
    process.env.REACT_APP_PUBLIC_PUSH_NOTIF_KEY
);

const isEvenSmall = window.Helper.isSmallScreen(450);
const deviceType = isEvenSmall ? "mobile" : "desktop";

export default async function subscribeUser({ role, userId }) {
    // n1
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        // Service Worker isn't supported on this browser, disable or hide UI.
        // Push isn't supported on this browser, disable or hide UI.
        throw new Error("Navegador sem suporte a notificações.");
    }

    // Lesson: if no response from here, it means there's no service worker installed in the browser.
    const registration = await navigator.serviceWorker.ready;

    const newSubscription = await registration.pushManager.subscribe({
        applicationServerKey: convertedVapidKey, // n2
        userVisibleOnly: true,
    });

    const params = { role, userId, deviceType };

    await sendSubscription(newSubscription, params);
    return "ok";
}

// HELPERS
// async function sendAndStoreSubscribe(subscription, params = {}) {
//     return await Promise.all([
//         setVar({ "subscription-renewal": JSON.stringify(subscription) }),
//         sendSubscription(subscription, params)
//     ]);
// }

async function sendSubscription(subscription, params = {}) {
    // n1
    return await getAPI({
        method: "post",
        url: subscribePushNotif(),
        body: subscription,
        params, // role, userId, deviceType
    });
}

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
