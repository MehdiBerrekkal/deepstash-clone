const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Full public-domain books ship as .txt assets (src/data/classics) and load only when opened.
config.resolver.assetExts.push('txt');

// The web app uses Expo Router's JavaScript stack so screens slide in and out like on iOS. Its web build swaps
// the swipe-back gesture for a stub; use the real one (react-native-gesture-handler works on the web) so you can
// drag a screen away from the left edge.
const stackViews = path.join('expo-router', 'build', 'react-navigation', 'stack', 'views');
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === '../GestureHandler' && context.originModulePath.includes(stackViews)) {
    return { type: 'sourceFile', filePath: path.join(path.dirname(context.originModulePath), '..', 'GestureHandlerNative.js') };
  }
  return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
