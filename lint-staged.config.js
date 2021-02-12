const runPrettier = () => {
    return (filenames) =>
        filenames.map((filename) => `prettier --write '${filename}'`);
};

const runEsLint = () => {
    return (filenames) =>
        filenames.map((filename) => `eslint --fix '${filename}'`);
};

module.exports = {
    "*.{js,jsx,css}": [
        runPrettier(),
        runEsLint()
    ],
};
