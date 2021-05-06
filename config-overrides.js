// https://github.com/arackaf/customize-cra/blob/master/api.md#addbabelpluginplugin
const { override, addBabelPlugins } = require("customize-cra");

module.exports = override(addBabelPlugins("styled-jsx/babel"));

/* ARCHIVES
  config = injectBabelPlugin(["styled-jsx/babel"], config);
*/
