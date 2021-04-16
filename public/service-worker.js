/* eslint-disable no-restricted-globals */
// FOR DEV ENVIRONMENT ONLY FILE - the production copy is generated with workbox.

self.addEventListener("push", async (event) => {
    const payload = event.data.json();
    const notifPromise = showNotification(payload);

    event.waitUntil(notifPromise);
});

// The common practice for a notification click is for it to close and perform some other logic (i.e. open a window or make some API call to the application)
// https://developers.google.com/web/fundamentals/push-notifications/notification-behaviour
// https://stackoverflow.com/questions/48547295/pwa-service-worker-notification-click
self.addEventListener("notificationclick", (event) => {
    const clickedNotification = event.notification;
    const extraOptions = clickedNotification.data || {};
    const clickedActionBtn = event.action; // it is an empty string if not clicked

    if (extraOptions.close) event.notification.close();

    const isNormalNotifClick = !clickedActionBtn;
    if (isNormalNotifClick) {
        const promise = focusOrOpenWindow("/mobile-app?abrir=1");
        event.waitUntil(promise);
        return;
    }

    switch (clickedActionBtn) {
        // using brackets to limit scope - https://stackoverflow.com/questions/50752987/eslint-no-case-declaration-unexpected-lexical-declaration-in-case-block/50753272
        case "close": {
            event.notification.close();
            break;
        }
        default: {
            const promise = focusOrOpenWindow(
                extraOptions[`url_${clickedActionBtn}`]
            );
            event.waitUntil(promise); // n1 You still need to make use of event.waitUntil() to keep the service worker running while your code is busy. - So, the waitUntil method is used to tell the browser not to terminate the service worker until the promise passed to waitUntil is either resolved or rejected.
        }
    }
});

// There is also a notificationclose event that is called if the user dismisses one of your notifications (i.e. rather than clicking the notification, the user clicks the cross or swipes the notification away).
// This event is normally used for analytics to track user engagement with notifications.
self.addEventListener("notificationclose", (event) => {
    const dismissedNotification = event.notification;
    console.log("dismissedNotification", dismissedNotification);
    // const promiseChain = notificationCloseAnalytics();
    // event.waitUntil(promiseChain);
});

// HELPERS
/*
https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
 */
async function showNotification(payload = {}) {
    let { title } = payload;
    const config = {
        tag: payload.tag, // if no id is passed, then notification will show up multiple times even if the same category of message. - An ID for a given notification that allows you to find, replace, or remove the notification using a script if necessary. - The tag option is simply a way of grouping messages so that any old notifications that are currently displayed will be closed if they have the same tag as a new notification. A subtlety to using tag is that when it replaces a notification, it will do so without a sound or vibration.
        // visual options
        body: payload.body || "",
        badge: payload.badge || "", // should be a transparent img - the icon alongside the site's url right in the right corner - The badge is a small monochrome icon that is used to portray a little more information to the user about where the notification is from -  a USVString containing the URL of an image to represent the notification when there is not enough space to display the notification itself such as for example, the Android Notification Bar. On Android devices, the badge should accommodate devices up to 4x resolution, about 96 by 96 px, and the image will be automatically masked.
        icon: payload.icon || "", // the icon inside the message in the left corner (can be the customer biz's logo)
        image: payload.image || "", // the body image - a USVString containing the URL of an image to be displayed in the notification.
        dir: payload.dir || "ltr",
        vibrate: payload.vibrate || [200, 100, 200, 100, 200, 100, 200], // n1
        // behavior options
        requireInteraction: payload.requireInteraction || false, // only on mobile - Indicates that on devices with sufficiently large screens, a notification should remain active until the user clicks or dismisses it. If this value is absent or false, the desktop version of Chrome will auto-minimize notifications after approximately twenty seconds. The default value is false.
        actions: payload.actions || [], // n2 array with objects - only works on mobile android - it does not appear in the desktop - the left side icon from the title
        lang: payload.lang || "pt-BR", // Specify the lang used within the notification. This string must be a valid BCP 47 language tag.
        data: payload.data || null, // Arbitrary data that you want to be associated with the notification. This can be of any data type.
        renotify: payload.renotify || false, // the notification beep still work even if it is false... A boolean that indicates whether to suppress vibrations and audible alerts when reusing a tag value. If renotify is true and tag is the empty string a TypeError will be thrown. - This largely applies to mobile devices at the time of writing. Setting this option makes new notifications vibrate and play a system sound. - There are scenarios where you might want a replacing notification to notify the user rather than silently update. Chat applications are a good example. In this case, you should set tag and renotify to true.
        silent: payload.silent || false, // WARNING: when this is true, the notification is not delivered.
    };

    if (!Notification) {
        console.log("This browser does not support notification");
        return false;
    }
    const { permission } = Notification;
    if (permission !== "granted") return false;

    const needCountAndMerge = config.data && !config.data.closeMergeOff;
    // newTitle and newBody is undefined for the first time. Only will return a value after the second notification in plural.
    if (needCountAndMerge) {
        const { newTitle, newBody, newData } = await countAndMergeNotifications(
            {
                registration: self.registration,
                options: payload,
                data: config.data,
            }
        );

        title = newTitle || title;
        config.body = newBody || config.body;
        config.data = newData || config.data;
    }

    checkBrowserMaxActions();

    // IN APP TOAST NOTIFICATION
    const needUiMsg = await needInAppNotif();

    if (needUiMsg) {
        const windowClients = await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        });

        windowClients.forEach((windowClient) => {
            windowClient.postMessage({
                title: payload.title,
                body: payload.body,
            });
        });

        return false;
    }
    // END IN APP TOAST NOTIFICATION

    return self.registration.showNotification(title, config);
}

function checkBrowserMaxActions() {
    // how many action buttons can be placed in a notification in the current browser.
    const maxVisibleActions = Notification.maxActions;
    if (maxVisibleActions < 4) {
        console.log(
            `This notification will only display ${maxVisibleActions} actions.`
        );
    } else {
        console.log(
            `This notification can display up to ${maxVisibleActions} actions.`
        );
    }
}

async function countAndMergeNotifications({ registration, options, data }) {
    const allNotifs = await registration.getNotifications(registration); // n3

    let currentNotification;

    const currTag = options.data.tag;
    for (let i = 0; i < allNotifs.length; i++) {
        if (allNotifs[i].data && allNotifs[i].data.tag === currTag) {
            currentNotification = allNotifs[i];
        }
    }

    if (currentNotification) {
        const messageCount = currentNotification.data.count + 1;
        const titlePlural = currentNotification.data.titleP;
        const bodyPlural = currentNotification.data.bodyP;

        // close the old notification
        currentNotification.close();

        return {
            newTitle: titlePlural,
            newBody: `${messageCount} ${bodyPlural}`,
            newData: {
                ...data,
                tag: currTag,
                count: messageCount,
            },
        };
    }

    return {
        newData: {
            ...data,
            tag: currTag,
            count: 1,
        },
    };
}

/*
only possible for pages on your origin. This is because we can only see what pages are open that belong to our site. This prevents developers from being able to see all the sites their users are viewing.
https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns
 */
async function focusOrOpenWindow(url) {
    const urlToOpen = new URL(url, self.location.origin).href; // http://localhost:3000/mobile-app?abrir=1

    const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    }); // n2

    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];

        if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
        }
    }

    // LESSONS: if the urlToOpen redirects to another page, then it always open a new window.
    if (matchingClient) {
        return matchingClient.focus();
    }

    // Note that you don't have window access in service-worker. To navigate to the URL, you'd need to use clients.openWindow instead.
    return self.clients.openWindow(urlToOpen);
}

// isClientFocused
// https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns#the_exception_to_the_rule
async function needInAppNotif() {
    const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    });

    let clientIsFocused = false;

    for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.focused) {
            clientIsFocused = true;
            break;
        }
    }

    return clientIsFocused;
}

// END HELPERS

/* COMMENTS
n1: waitUntil
One of the things to understand about service workers is that you have little control over when the service worker code is going to run. The browser decides when to wake it up and when to terminate it. The only way you can tell the browser, "Hey, I'm super busy doing important stuff", is to pass a promise into the event.waitUntil() method. With this, the browser will keep the service worker running until the promise you passed in has settled.

n2: response example:
focused: false
frameType: "top-level"
id: "abce11c1-7957-4df4-8766-eaa77f6289c3"
type: "window"
url: "http://localhost:3000/t/app/nucleo-equipe"
visibilityState: "visible"

The options passed into matchAll inform the browser that we only want to search for "window" type clients (i.e. just look for tabs and windows and exclude web workers). includeUncontrolled allows us to search for all tabs from your origin that are not controlled by the current service worker, i.e. the service worker running this code. Generally, you'll always want includeUncontrolled to be true when calling matchAll().
https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns
*/

/* FIND IF CURRENT PAGE IS OPEN AND FOCUSED TO PREVENT SHOW NOTIFICATION
const promiseChain = isClientFocused()
.then((clientIsFocused) => {
  if (clientIsFocused) {
    console.log('Don\'t need to show a notification.');
    return;

  }

  // Client isn't focused, we need to show a notification.
  return self.registration.showNotification('Had to show a notification.');
});

event.waitUntil(promiseChain);
Inside push event:
const promiseChain = isClientFocused()
.then((clientIsFocused) => {
  if (clientIsFocused) {
    console.log('Don\'t need to show a notification.');
    return;

  }

  // Client isn't focused, we need to show a notification.
  return self.registration.showNotification('Had to show a notification.');
});

event.waitUntil(promiseChain);

 */

/*
MESSAGE A PAGE FROM A PUSH EVENT
We've seen that you can skip showing a notification if the user is currently on your site. But what if you still want to let the user know that an event has occurred, but a notification is too heavy handed?
One approach is to send a message from the service worker to the page, this way the web page can show a notification or an update to the user, informing them of the event. This is useful for situations when a subtle notification in the page is better and friendlier for the user.
Let's say we've received a push, checked that our web app is currently focused, then we can "post a message" to each open page, like so:


const promiseChain = isClientFocused()
.then((clientIsFocused) => {
  if (clientIsFocused) {
    windowClients.forEach((windowClient) => {
      windowClient.postMessage({
        message: 'Received a push message.',
        time: new Date().toString()
      });
    });
  } else {
    return self.registration.showNotification('No focused windows', {
      body: 'Had to show a notification instead of messaging each page.'
    });
  }
});

event.waitUntil(promiseChain);
In each of the pages, we listen for messages by adding a message event listener:


navigator.serviceWorker.addEventListener('message', function(event) {
  console.log('Received a message from service worker: ', event.data);
});
In this message listener, you could do anything you want, show a custom UI on your page or completely ignore the message.

It's also worth noting that if you don't define a message listener in your web page, the messages from the service worker will not do anything.
 */

/*
Cache a page and open a window
One scenario that is out of the scope of this guide but worth discussing is that you can improve the overall UX of your web app by caching web pages you expect users to visit after clicking on your notification.

This requires having your service worker set-up to handle fetch events, but if you implement a fetch event listener, make sure you take advantage of it in your push event by caching the page and assets you'll need before showing your notification.

For more information, check out this introduction to service workers post.
 */

/* ARCHIVE WORKBOX
// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
// precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({ request, url }) => {
        // If this isn't a navigation, skip.
        if (request.mode !== "navigate") {
            return false;
        } // If this is a URL that starts with /_, skip.

        if (url.pathname.startsWith("/_")) {
            return false;
        } // If this looks like a URL for a resource, because it contains // a file extension, skip.

        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        } // Return true to signal that we want to use the handler.

        return true;
    },
    createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`)
);

An example runtime caching route for requests that aren't handled by the
precache, in this case same-origin .png requests like those from in public/
registerRoute(
    // Add in any other file extensions or routing criteria as needed.
    ({ url }) =>
        url.origin === self.location.origin && url.pathname.endsWith(".png"), // Customize this strategy as needed, e.g., by changing to CacheFirst.
    new StaleWhileRevalidate({
        cacheName: "images",
        plugins: [
            // Ensure that once this runtime cache reaches a maximum size the
            // least-recently used images are removed.
            new ExpirationPlugin({ maxEntries: 50 }),
        ],
    })
);

*/
