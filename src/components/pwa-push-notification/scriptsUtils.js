// resouces:
// https://github.com/MicrosoftEdge/pushnotifications-demo/blob/master/src/scripts/util.js
// https://github.com/MicrosoftEdge/pushnotifications-demo/blob/master/src/service-worker.js

export function subscribePush(registration) {
    return getPublicKey().then((key) =>
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key,
        })
    );
}

export function renewSubscription(subData) {
    return publishSubscription(subData);
}

export function treatSubData(currSub) {
    if (!currSub) return false;

    const { endpoint, expirationTime } = currSub;
    const { p256dh, auth } = currSub.toJSON().keys;

    return {
        endpoint,
        expirationTime,
        keys: {
            p256dh,
            auth,
        },
    };
}

// HELPERS
function getPublicKey() {
    return fetch(
        "https://fiddelize.herokuapp.com/api/push-notification/public-key"
    )
        .then((response) => response.json())
        .then((data) => urlB64ToUint8Array(data.key));
}

function publishSubscription({ oldEndpoint, newSub, isBrowser = false }) {
    const renewalOrigin = isBrowser ? "browser" : "serviceWorker";
    // for deviceType, the backend will detect if it is desktop or mobile according to the oldsub key

    return fetch(
        "https://fiddelize.herokuapp.com/api/push-notification/renewal",
        {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ oldEndpoint, newSub, renewalOrigin }),
        }
    );
}

function urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
// END HELPERS

/* ARCHIVES

function deleteSubscription(subscription) {
    return publishSubscription(subscription, true);
}

*/
