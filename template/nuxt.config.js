module.exports =  {
	
	// Whether to collect anonymous telemetry data
	telemetry:{{telemetry}},

	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: false,

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: '{{name}}',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		]
	},
  
  
	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
	],
  
	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,
  
	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
	],
  
	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
	],
  
	// Build Configuration: https://go.nuxtjs.dev/config-build
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
			// use web as target when not using node integration 
			if (isClient) { config.target = 'web' }
			// use electron-renderer as target when node integration is in use
			// if (isClient) { config.target = 'electron-renderer' }
		}
	},
	css: [
		'@/assets/css/global.css'
	]
  }
  