// https://github.com/arackaf/customize-cra/blob/master/api.md#addbabelpluginplugin
const { override, addBabelPlugins } = require("customize-cra");

module.exports = override(addBabelPlugins("styled-jsx/babel"));

/*
LESSON: using react-app-rewired and replace this in the package.json in place of react-scripts
will load a blank page on production env. Using only customize-cra to override underneath babel, webpack configs is enough and works just fine.
*/

/* ARCHIVES
  config = injectBabelPlugin(["styled-jsx/babel"], config);
*/
