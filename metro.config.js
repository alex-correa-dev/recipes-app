const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("js", "jsx", "ts", "tsx", "json");
config.resolver.assetExts.push("png", "jpg", "jpeg", "gif", "svg");

module.exports = config;
