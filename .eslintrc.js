module.exports = {
    env: {
        browser: true,
        es6: true,
        commonjs: true,
    },
    extends: ["airbnb", "plugin:react/recommended", "plugin:import/errors", "plugin:import/warnings"],
    parserOptions: {
        // "parser": 'babel-eslint',
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018, // understands let, const and other features
        sourceType: "module",
        allowImportExportEverywhere: true,
    },
    plugins: ["react", "jsx-a11y", "unused-imports", "react-hooks"],
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
        "no-unused-vars": "off",
        // end plugin unused-imports
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/jsx-indent-props": "off",
        "react/jsx-indent": "off",
        "react/prop-types": "off",
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }], // (error  JSX not allowed in files with extension '.js') You can add the following to your config to allow .js extensions for JSX.
        "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: true },
        ],
        "import/no-named-as-default": "off",
        "import/no-named-as-default-member": "off",
        "import/no-extraneous-dependencies": "off",
        "linebreak-style": "off",
        indent: "off",
        "no-param-reassign": "off", // userId = userId || _id;
        "react/react-in-jsx-scope": "off", //  from React version 17 you don’t have to import React from 'react' anymore and you can disable linting rules
        "react/jsx-uses-react": "off",
        'react-hooks/rules-of-hooks': 'error', // React (if using hooks)
        'react-hooks/exhaustive-deps': 'warn', // React (if using hooks)
    },
    settings: {
        react: {
          version: 'detect', // React
        }
    }
};

/*

 */
