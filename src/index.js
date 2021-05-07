import ReactDOM from "react-dom";
import App from "./_main/App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import reportWebVitals from "./reportWebVitals";

ReactDOM.render(<App />, document.getElementById("root"));

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
