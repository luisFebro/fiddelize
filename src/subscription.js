import { CLIENT_URL } from './config/clientUrl';

function urlBase64ToUint8Array(base64String) {
    if(!base64String) {
        console.log("base64String is not passed or is in an invalid format other than string. Check if your PUBLIC_VAPID_KEY is declared correctly both in dev and production env.")
        return;
    }

    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    // eslint-disable-next-line
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for(let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY);

function sendSubscription(subscription) { // n1
    return fetch(`${CLIENT_URL}/api/push-notification/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function subscribeUser() {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
        .then(function(registration) {
                if(!registration.pushManager) {
                    console.log('Push manager unavailable.')
                    return;
                }

                registration.pushManager.getSubscription()
                .then(function(existedSubscription) {
                    if(existedSubscription === null) {
                        console.log('No subscription detected, making a request.')
                        registration.pushManager.subscribe({
                            applicationServerKey: convertedVapidKey,
                            userVisibleOnly: true,
                        }).then(function(newSubscription) {
                            sendSubscription(newSubscription)
                            console.log('New subscription added.')
                        }).catch(function(e) {
                            if(Notification.permission === 'denied') {
                                console.log('Permission was not granted. User clicked on BLOCK BTN')
                            } else if(Notification.permission === 'denied') {
                                console.log("Permission was not granted. User clicked on X to IGNORE THE PROMPT")
                            } else {
                                console.error('An error ocurred during the subscription process.', e)
                            }
                        })
                    } else {
                        console.log('Existed subscription detected.')
                        sendSubscription(existedSubscription)
                    }
                })
            })
            .catch(function(e) {
                console.error('An error ocurred during Service Worker registration.', e)
            })
    }
}

// ALTERNATIVE TO NOTIFY USER
// reference: https://developer.mozilla.org/en-US/docs/Web/API/notification
export function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

/* COMMENTS
n1: subscription example which is sent to backend after successfully subscribe a user:
Google Chrome
{
  endpoint: 'https://fcm.googleapis.com/fcm/send/chhjHsBv3DU:APA91bGJCZnXCfkGeAa2nlo5n3fkP4aNw1J7Y34s9neghg0KowAKJcUqIbm97TuuASOD8VD4CpWNpVrKaX3E1f-rwLaINlKOCwGUFCUtZG9qpYNBT3edlEF0mznLK3gJN3rp7XwJAc2y',
  expirationTime: null,
  keys: {
    p256dh: 'BBe1YEEq3YuUwYxekAYug5xdjTg18IUkvdTLjRjshN4lnbytK-b7_3iAbYEpgjsFRvboIPsc3h_3wWM8TCRisSc',
    auth: 'uQq5Eyjzvwv66ddqwXa1PA'
  }
}
*/

// // TRAVERSY VERSION
// const publicVapidKey = process.env.REACT_APP_PUBLIC_VAPID_KEY // NEed to be change in netlify to REACT_APP...

// // Register SW, Register Push, Send Push
// async function send() {
//   // Register Service Worker
//   const register = await navigator.serviceWorker.register("/service-worker.js", {
//     scope: "/"
//   });

//   // Register Push
//   const subscription = await register.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
//   });

//   // Send Push Notification
//   await fetch("/subscribe", {
//     method: "POST",
//     body: JSON.stringify(subscription),
//     headers: {
//       "content-type": "application/json"
//     }
//   });
// }

// function urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding)
//     .replace(/\-/g, "+")
//     .replace(/_/g, "/");

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }