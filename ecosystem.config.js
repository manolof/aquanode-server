module.exports = {
	apps: [{
		name: 'aquanode-server',
		script: './dist/src/server.js',

		// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
		max_memory_restart: '512M',
		env: {
			NODE_ENV: 'production'
		},
	}],
};
