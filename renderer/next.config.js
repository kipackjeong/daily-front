module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
  env: {
    prod_mongodburl:
      "mongodb+srv://kipackjeong:A20181004a%3F@daily-test.clvjbwe.mongodb.net/test",
    dev_mongodburl:
      "mongodb+srv://kipackjeong:A20181004a%3F@daily-test.clvjbwe.mongodb.net/test",
    apiurl: "http://localhost:3000",
  },
};
