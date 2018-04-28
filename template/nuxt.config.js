const prodRouterBase = process.env.NODE_ENV === 'DEV' ? {} : {router: {base: './'}}

module.exports = {...prodRouterBase,
	mode: 'spa',
	head: {title: '{{name}}'}, // Headers of the page
	loading: false, // Disable default loading bar
	generate: {dir: 'dist/electron'},
	build: {
		extend (config, { isDev, isClient }) {
			if (isDev && isClient) {
				// Run ESLint on save
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				})
			}
			// Extend only webpack config for client-bundle
			if (isClient) { config.target = 'electron-renderer' }
		}
	},
	dev: process.env.NODE_ENV === 'DEV',
	css: [
		'@/assets/css/global.css'
	],
	rootDir: __dirname
}
