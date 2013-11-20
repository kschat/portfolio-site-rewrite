//SearchItem.js

var _ = require('underscore'),
	Backbone = require('backbone');

exports = module.exports = Backbone.Model.extend({
	url: function() {
		return '/api/search?q=' + this.get('query');
	},
	
	defaults: {
		query: '',
		type: '',
		title: '',
		description: ''
	}
});