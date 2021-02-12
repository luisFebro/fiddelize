module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
    parserOptions: {
        // "parser": 'babel-eslint',
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018, // understands let, const and other features
        sourceType: "module",
        allowImportExportEverywhere: true,
    },
    plugins: ["react", "jsx-a11y", "unused-imports"],
    //0 - Disable the rule, 1 - Warn about the rule, 2 - Throw error about the rule
    rules: {
        indent: ["error", "tab"],
        "linebreak-style": ["error", "windows"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        // plugin unused-imports
        "unused-imports/no-unused-imports": "error", // this will exclude all unused imports from my files
        "unused-imports/no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_",
            },
        ],
        "no-unused-vars": 0,
        // end plugin unused-imports
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/jsx-indent-props": 0,
        "react/jsx-indent": 0,
        "react/prop-types": 0,
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }], // (error  JSX not allowed in files with extension '.js') You can add the following to your config to allow .js extensions for JSX.
        "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: true },
        ],
        "import/no-named-as-default": 0,
        "import/no-named-as-default-member": 0,
        "import/no-extraneous-dependencies": 0,
        "linebreak-style": 0,
        indent: 0,
        "no-param-reassign": 0, // userId = userId || _id;
        // "unused-imports/no-unused-vars": "error",
    },
};

/*

 */
