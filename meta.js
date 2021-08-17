module.exports = {
	helpers: {
		escape: function(value) {
			return value.replace(/'/g, '&apos;');
		}
	},
	prompts: {
		name: {
			'type': 'string',
			'required': true,
			'message': 'Project name'
		},
		description: {
			'type': 'string',
			'required': false,
			'message': 'Project description',
			'default': 'Nuxt + Electron'
		},
		author: {
			'type': 'string',
			'message': 'Author'
		},
		appId: {
			'type': 'string',
			'required': true,
			'message': 'App Id (e.g. com.example.app)'
		},
		telemetry:{
			'type': 'boolean',
			'required': true,
			'message': 'Nuxt Telemetry'
		}
	},
	completeMessage: '{{#inPlace}}To get started:\n\n  npm install # Or yarn\n  npm run dev{{else}}To get started:\n\n  cd {{destDirName}}\n  npm install # Or yarn\n  npm run dev{{/inPlace}}'
};
