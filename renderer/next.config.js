module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
  env: {
    mongodburl:
      "mongodb+srv://kipackjeong:A20181004a%3F@daily-test.clvjbwe.mongodb.net/test",
  },
};
