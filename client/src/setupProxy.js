// reference: https://medium.com/bb-tutorials-and-thoughts/react-how-to-proxy-to-backend-server-5588a9e0347
const { createProxyMiddleware } = require("http-proxy-middleware");

// REVERSE PROXY
module.exports = function (app) {
    app.use(
        "/api/pay/pag-notify",
        createProxyMiddleware({
            target: "http://localhost:5000",
            changeOrigin: true,
        })
    );
};
