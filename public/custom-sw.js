// This package is causing trouble: "cra-append-sw": "^2.7.0"
// && cra-append-sw --skip-compile ./public/custom-sw.js
// 4:29:21 PM: There might be a problem with the project dependency tree.
// 4:29:21 PM: It is likely not a bug in Create React App, but something you need to fix locally.
// 4:29:21 PM: The react-scripts package provided by Create React App requires a dependency:
// 4:29:21 PM:   "babel-loader": "8.0.6"
// SOLUTION: I had to reinstall create-react-app and dependencies with the same version:
// npm i @date-io/moment": "1.3.13 @fortawesome/fontawesome-svg-core@1.2.27 @fortawesome/free-solid-svg-icons@5.12.1 @fortawesome/react-fontawesome@0.1.9 @material-ui/core@4.7.2 @material-ui/icons@4.5.1 @material-ui/lab@4.0.0-alpha.35 @material-ui/pickers@3.2.8 animate.css@3.7.0 aos@2.3.4 axios@0.19.0 bootstrap@4.4.1 easy-peasy@3.1.0 html-react-parser@0.10.0 moment@2.24.0 node-sass@4.13.1 react-google-login@5.0.7 react-loadable@5.5.0 react-router-dom@5.1.2 react-router-hash-link@1.2.2 react-router-scroll-top@0.2.1 react-router-sitemap@1.2.0 react-slick@0.25.2 react-tilt@0.1.4 sharethis-reactjs@1.5.0 slick-carousel@1.8.1 styled-components@4.4.1 uuid@3.3.3
//
self.addEventListener('push', event => { //n1
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: "http://image.ibb.co/frYOFd/tmlogo.png",
        requireInteraction: true,
    }

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
})


/* COMMENTS
n1: traversy version:
console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Notified by Traversy Media!",
    icon: "http://image.ibb.co/frYOFd/tmlogo.png"
  });
});
*/

