// reference: https://medium.com/bb-tutorials-and-thoughts/react-how-to-proxy-to-backend-server-5588a9e0347
const { createProxyMiddleware } = require("http-proxy-middleware");
const { IS_DEV } = require("./config/clientUrl");

// REVERSE PROXY
// This is not working any longer on PRODUCTION, only DEV...
module.exports = function (app) {
    app.use(
        "/api/pay/pag-notify",
        createProxyMiddleware({
            target: IS_DEV
                ? "http://localhost:5000"
                : "https://fiddelize.herokuapp.com",
            changeOrigin: true,
        })
    );
};
