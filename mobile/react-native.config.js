module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null, // Disable auto-linking for iOS to avoid font duplication issues
      },
    },
  },
  assets: ['./src/assets/fonts/'],
};
