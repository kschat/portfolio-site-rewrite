var Backbone = require('backbone');

exports = module.exports = Backbone.Router.extend({
	constructor: function(options) {
		this.options = options;
		Backbone.Router.call(this, options);
	},

	routes: {
		'projects': 'projects',
		'resume': 'resume',
		'blog': 'blog',
		'about': 'about',
		'': 'about'
	},

	about: function() {
		this.options.vent.trigger('route:about');
	},

	projects: function() {
		this.options.vent.trigger('route:projects');
	},

	resume: function() {
		this.options.vent.trigger('route:resume');
	},

	blog: function() {
		this.options.vent.trigger('route:blog');
	}
});