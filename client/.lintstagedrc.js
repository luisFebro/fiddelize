const getFileName = (fileName) => {
    const lastSlashInd = fileName.lastIndexOf("/");
    return fileName.slice(lastSlashInd + 1);
}

const runPrettier = () => {
    return (filenames) =>
        filenames.map((filename) => `echo ${getFileName(filename)} & prettier --write '${filename}'`);
};

const runEsLinter = () => {
    return (filenames) =>
        filenames.map((filename) => `eslint --fix '${filename}'`);
};

module.exports = {
    "*.{js,jsx,css}": [
        runPrettier(),
        // eunEsLinter(),
    ],
};
