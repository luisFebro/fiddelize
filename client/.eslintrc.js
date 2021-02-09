module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb",
        "plugin:react/recommended",
        "prettier"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018, // understands let, const and other features
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "unused-imports",
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        // plugin unused-imports
        "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error", // this will exclude all unused imports from my files
        "unused-imports/no-unused-vars": [
            "warn",
            { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
        ],
        // end plugin unused-imports
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/jsx-indent-props": "off"
    },
    "settings": {
        "react": {
            "version": "detect",
        }
    }
};

/*

 */