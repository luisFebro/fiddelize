// reference: https://tylerzey.com/create-react-app-purge-css/
// TEMPORARILY DISABLED - need craco and glob-all modules because server post-build is failing...
const path = require("path");
const fs = require("fs");
const glob = require("glob-all");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = {
    webpack: {
        plugins: [
            new PurgecssPlugin({
                paths: [
                    resolveApp("public/index.html"),
                    ...glob.sync(`${resolveApp("src")}/**/**/*`, {
                        nodir: true,
                    }),
                ],
            }),
        ],
    },
};
