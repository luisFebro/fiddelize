// use to fix all fixable warnings
// npx eslint ./src/**/*.js* --fix

module.exports = {
    env: {
        browser: true,
        es6: true,
        commonjs: true,
    },
    extends: [
        "airbnb",
        "plugin:react/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "prettier",
        "prettier/react",
    ], // add eslint-config-prettier to the "extends" array in your .eslintrc.* file. Make sure to put it last, so it gets the chance to override other configs. || other note: If you extend a config which uses a plugin, it is recommended to add "prettier/that-plugin" (if available). For example, eslint-config-airbnb enables eslint-plugin-react rules, so "prettier/react" is needed
    parser: "babel-eslint",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 8, // understands let, const and other features
        sourceType: "module",
        allowImportExportEverywhere: true,
    },
    plugins: ["react", "jsx-a11y", "unused-imports", "react-hooks"],
    // 0 - Disable the rule, 1 - Warn about the rule, 2 - Throw error about the rule
    rules: {
        "linebreak-style": "off", // If you aren't concerned about having different line endings within your code, then you can safely turn this rule off.
        semi: "off", // semicollons are inserted automatically with Prettier.
        quotes: "off", // handled by prettier
        // plugin unused-imports
        "unused-imports/no-unused-imports": "error", // imports are only removed with this warning on (error) // before off
        "unused-imports/no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_",
            },
        ],
        "no-unused-vars": "off",
        // end plugin unused-imports
        "react/jsx-uses-vars": "error",
        "react/jsx-indent-props": "off",
        "react/jsx-indent": "off",
        "react/react-in-jsx-scope": "off", //  from React version 17 you don’t have to import React from 'react' anymore and you can disable linting rules
        "react/jsx-fragments": "off", // enforces shorthand <></> but this causes styling issues with the underneath code for now
        "react/jsx-uses-react": "off",
        "react-hooks/rules-of-hooks": "error", // React (if using hooks)
        "react-hooks/exhaustive-deps": "warn", // React (if using hooks)
        "react/prop-types": "off",
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }], // (error  JSX not allowed in files with extension '.js') You can add the following to your config to allow .js extensions for JSX.
        "import/no-extraneous-dependencies": "off", // alerts for "@material-ui/core/Card", "react"
        "import/no-named-as-default": "off",
        "import/no-named-as-default-member": "off",
        "import/no-named-default": "off", // reports when { default as newName } renaming import structure
        indent: "off",
        "no-param-reassign": "off", // userId = userId || _id;
        "max-len": "off", // max-length by line handled by prettier
        "no-console": "off", // using switchConsoleLogs security utils. activated only in dev
        "no-use-before-define": ["error", { functions: false }], // allow functions to be declared after the usage
        "no-return-await": "off",
        "no-underscore-dangle": ["error", { allow: ["_id"] }],
    },
    settings: {
        react: {
            version: "detect", // React
        },
    },
};

/*

 */
