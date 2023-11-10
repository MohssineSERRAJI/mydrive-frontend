const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Entry point of your React application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output bundle filename
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Process JavaScript and JSX files
        exclude: /node_modules/,
        use: "babel-loader", // You'll need to set up Babel for React
      },
      {
        test: "/.(scss|sass)$",
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // HTML template for your app
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    contentBase: "./dist", // Serve files from the 'dist' directory
    port: 3000, // Port for the development server
  },
};
