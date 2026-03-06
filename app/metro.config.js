const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

config.resolver.blockList = [
  /(?:__tests__[/\\]|\.(?:test|spec)\.(?:tsx?|jsx?)$|node_modules[/\\]@testing-library[/\\])/,
];

module.exports = config;