const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Notice it uses "./" because it's in the same folder as this config file
module.exports = withNativeWind(config, { input: "./global.css" });