import path from "path";
import { fileURLToPath } from "url";
import slsw from "serverless-webpack";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: slsw.lib.entries, // automatically picks up every function handler
  target: "node20", // compile for Node.js 20 runtime
  mode: "production", // enable minification and tree-shaking
  output: {
    libraryTarget: "commonjs2", // required for Lambda handlers
    path: path.resolve(__dirname, ".webpack/service"),
    filename: "[name].js", // one bundle per function
  },
  resolve: {
    extensions: [".js", ".json"], // resolve these extensions
  },
  module: {
    rules: [
      // add loaders here if needed (e.g., Babel)
    ],
  },
  externals: [
    // leave AWS SDK out (Lambda has it built-in)
    // "aws-sdk",
    nodeExternals({
      allowlist: ["pg", "pg-hstore", "aws-sdk"], // include Sequelize’s Postgres drivers
    }),
  ],
  plugins: [
    // ignore optional/deferred modules that cause build errors
    // new webpack.IgnorePlugin({ resourceRegExp: /^pg-hstore$/ }),
    new webpack.IgnorePlugin({ resourceRegExp: /^bufferutil$/ }),
    new webpack.IgnorePlugin({ resourceRegExp: /^utf-8-validate$/ }),
  ],
  stats: "minimal", // quieter console output
};
