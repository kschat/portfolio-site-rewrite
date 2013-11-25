var Backbone = require('backbone');

exports = module.exports = Backbone.Router.extend({
	constructor: function(options) {
		Backbone.Router.call(this, options);
		this.vent = options.vent;
	},

	routes: {
		'projects': 'projects',
		'resume': 'resume',
		'blog': 'blog',
		'about': 'about',
		'': 'about'
	},

	about: function() {
		this.vent.trigger('route:about');
	},

	projects: function() {
		this.vent.trigger('route:projects');
	},

	resume: function() {
		this.vent.trigger('route:resume');
	},

	blog: function() {
		this.vent.trigger('route:blog');
	}
});