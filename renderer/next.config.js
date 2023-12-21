module.exports = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.target = 'electron-renderer';
		}

		return config;
	},
	env: {
		apiurl: 'http://localhost:4001',
	},
};
