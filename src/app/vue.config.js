const { defineConfig } = require("@vue/cli-service");

require("dotenv").config({ path: "../../.env" });

module.exports = defineConfig({
  transpileDependencies: ["quasar"],

  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
  },

  devServer: {
    port: 3040,
  },
});
