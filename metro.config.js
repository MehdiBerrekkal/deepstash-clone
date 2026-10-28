const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Full public-domain books ship as .txt assets (src/data/classics) and load only when opened.
config.resolver.assetExts.push('txt');

module.exports = config;
