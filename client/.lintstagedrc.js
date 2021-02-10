module.exports = {
    "*.{js,jsx,css}": (filenames) =>
        filenames.map((filename) => `prettier --write '${filename}'`),
};
