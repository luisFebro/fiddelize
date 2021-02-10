// const getFileName = (fileName) => {
//     const lastSlashInd = fileName.lastIndexOf("/");
//     return fileName.slice(lastSlashInd + 1);
// }

module.exports = {
    "*.{js,jsx,css}": [
        (filenames) =>
            filenames.map((filename) => `prettier --write '${filename}'`),
        (filenames) =>
            filenames.map((filename) => `eslint --fix '${filename}'`),
    ],
};
