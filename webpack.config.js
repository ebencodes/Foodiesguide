//This is the built in node package for the absolute path required in the output object
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // All we need to do is specify the entry property in this object
  //The entry variable is the starting path from where webpack would start to bundle.
  // it starts looking for all the dependencies to bundle together from this file.
  //We polyfill syntax that were not present in ES5 e.g promises
  entry: ["@babel/polyfill", "./src/js/index.js"],
  output: {
    //This is the part to the folder and it needs to be an absolute part and you need a built-in node package
    path: path.resolve(__dirname, "dist"),
    // This is the file name
    filename: "js/bundle.js",
  },
  devServer: {
    //Here we specify the folder from which webpack would serve our files
    //contentBase is where the compiled content would be saved
    contentBase: "./dist",
  },
  plugins:
    // Plugins allows us to do complex processing of our file. It requires an array
    [
      /**This would help us copy the .html file into the dist
    folder and inject the js link at the bottom of the .html file**/
      new HtmlWebpackPlugin({
        filename: "index.html",
        //template is our starting html file
        template: "./src/index.html",
      }),
    ],

  //loaders help to load and process all kinds of differnt files
  //like converting a SaaS file to CSS or ES6/ESnext to ES5
  //Babel loader syntax is below
  module: {
    //rules receive an array of the loaders required
    rules: [
      //for each loader we need an object
      {
        //the test property is to indicate that we want to test for all js files
        test: /\.js$/,
        //exclude is to exclude files we dont want babel to compile
        //node_modules are not to be compiled to ES5
        exclude: /node_modules/,
        //use property is used to indicate the loader used
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
