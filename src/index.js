// eslint-disable-next-line
import React from "react";
import ReactDOM from "react-dom";
import { createStore, StoreProvider } from "easy-peasy";
import App from "./_main-app/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import reportWebVitals from "./reportWebVitals";
import { easyStore } from "./redux/_easyStore";
// import './wdyr';

// State Management - Redux and Context

const store = createStore(easyStore);

ReactDOM.render(
    <StoreProvider store={store}>
        <App />
    </StoreProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);

/*
We have used these metrics with Lighthouse on the Chrome DevTools. Now Create React App 4 provides an option to measure them directly from applications.
Time to First Byte (TTFB): It measures the time for a browser to receive the first byte of page content.
First Contentful Paint (FCP): It measures the time from when the page starts loading to when any part of the page’s content is rendered on the screen.
Cumulative Layout Shift (CLS): It measures visual stability — whether elements on the page shift in ways that users do not expect and potentially interfere with their interactions.
Largest Contentful Paint (LCP): It measures perceived load speed, as it marks the point in the page load timeline when the page’s main content has likely loaded.
 */

function showNotification() {
    Notification.requestPermission(function (result) {
        if (result === "granted") {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification("Cliente bateu meta", {
                    body: "Erica bateu 500 pontos e ganhou um par de ingresso",
                    badge: "/img/logo.png", // the icon alongside the site's url right in the right corner
                    icon: "/img/test/vocariza.png", // the icon inside the message in the left corner (can be the customer biz's logo)
                    image: undefined, // the body image - a USVString containing the URL of an image to be displayed in the notification.
                    vibrate: [200, 100, 200, 100, 200, 100, 200],
                    tag: "id123", //  An ID for a given notification that allows you to find, replace, or remove the notification using a script if necessary.
                    requireInteraction: true, // default false
                    actions: [
                        {
                            title: "acessar app",
                            icon: "/img/logo.png",
                            action:
                                "<a href=`http://localhost:3000/t/app/nucleo-equipe` target=`_self` />",
                        },
                    ],
                });
            });
        }
    });
}

showNotification();
