const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

// Function to find all handler files recursively
function findHandlers(dir) {
  const entries = {};

  // First, check for .ts files directly in the handlers directory
  fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    if (
      dirent.isFile() &&
      dirent.name.endsWith(".ts") &&
      !dirent.name.endsWith(".d.ts")
    ) {
      const name = path.parse(dirent.name).name;
      entries[name] = path.join(dir, dirent.name);
    }
  });

  // Then, list immediate subdirectories of src/handlers
  fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    if (!dirent.isDirectory()) return;
    const sub = dirent.name;
    const subdir = path.join(dir, sub);
    // grab every .ts (not .d.ts) in that subfolder
    fs.readdirSync(subdir).forEach((file) => {
      if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
        const name = `${sub}/${path.parse(file).name}`;
        entries[name] = path.join(subdir, file);
      }
    });
  });
  return entries;
}
const handlersDir = path.resolve(__dirname, "src", "handlers");
const handlers = findHandlers(handlersDir);
console.log("Handler entries:", Object.keys(handlers));

// Function to create isolated webpack config for a single handler
module.exports = {
  mode: "production",
  target: "node",

  // Single entry point for complete isolation
  entry: handlers,

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].mjs",
    library: {
      type: "module",
    },
    clean: true, // Only clean on first build
    chunkFormat: false, // Disable chunk format to prevent chunk creation
  },
  externals: {
    // Don't bundle AWS SDK - it's provided by Lambda runtime
    "aws-sdk": "aws-sdk",
    "@aws-sdk/client-s3": "commonjs @aws-sdk/client-s3",
    "@aws-sdk/client-lambda": "commonjs @aws-sdk/client-lambda",
    "@aws-sdk/client-sns": "commonjs @aws-sdk/client-sns",
    "@aws-sdk/client-ses": "commonjs @aws-sdk/client-ses",
    "@aws-sdk/client-sfn": "commonjs @aws-sdk/client-sfn",
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },

  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: "esnext",
                target: "es2020",
                moduleResolution: "node",
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
                resolveJsonModule: true,
                sourceMap: false,
                declaration: false,
                declarationMap: false,
                removeComments: true,
                isolatedModules: true,
                skipLibCheck: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    // Add a banner to make require() available in ES modules
    new webpack.BannerPlugin({
      banner: `import {createRequire} from 'module';const require=createRequire(import.meta.url);`,
      raw: true,
    }),
  ],

  optimization: {
    minimize: false,
    // Completely disable chunk splitting
    splitChunks: false,
    // Disable runtime chunk
    runtimeChunk: false,
    // Disable module concatenation that could cause issues
    concatenateModules: false,
    // Disable side effects optimization that could split modules
    sideEffects: false,
    // Disable used exports optimization that could split modules
    usedExports: false,
  },

  performance: {
    hints: false,
  },

  stats: {
    warnings: false,
  },

  // Disable source maps for production
  devtool: false,
};
