const webpush = require("web-push"); // n1

// const vapidKeys = webpush.generateVAPIDKeys(); //generate it only once

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY; // n3

webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_DEV}`,
  publicVapidKey,
  privateVapidKey
);

// subscribe users
exports.getPushNotification = (req, res) => {
    const subscription = req.body;

    const createdPayload = JSON.stringify({
        title: 'Hello!',
        body: 'It works.',
    });

    res.status(201).json({}); // n2

    webpush
        .sendNotification(subscription, createdPayload)
        .then(result => console.log(result))
        .catch(err => console.error(err.stack));

};

/* COMMENTS
n1: lib reference: https://github.com/web-push-libs/web-push
n2: Send 201 - resource created
200 when an object is created and returned
201 when an object is created but only its reference is returned (such as an ID or a link)
n3: What is VAPID and WHY use it?
VAPID (Voluntary Application Server Identification) is the newest way to receive and send push notifications through the web.

Before it was handled by FCM/GCM keys (Firebase Cloud Messaging / Google Cloud Messaging). Google started everything... As VAPID is a new protocol for messaging in the web, most of the applications are migrating to it, because of the easier implementation.

An application server can voluntarily identify itself to a push service using the described technique. This identification information can be used by the push service to attribute requests that are made by the same application server to a single entity. This can used to reduce the secrecy for push subscription URLs by being able to restrict subscriptions to a specific application server. An application server is further able to include additional information that the operator of a push service can use to contact the operator of the application server.
So there are two reasons for VAPID.
The first is to restrict the VALIDITY OF A SUBSCRIPTION to a specific application server (so, by using VAPID, only your server will be able to send notifications to a subscriber).
The second is to add more information to the push notification, so that the push service operator knows who is sending the notifications. If something is going wrong with your notifications, the operator knows who you are and can contact you. Moreover, they can offer you some kind of interface to monitor your push notifications.
reference: https://stackoverflow.com/questions/40392257/what-is-vapid-and-why-is-it-useful
*/