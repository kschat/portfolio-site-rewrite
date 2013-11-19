//PanelModel.js

var _ = require('underscore'),
	Backbone = require('backbone');

exports = module.exports = Backbone.Model.extend({
	url: function() {
		return '/' + this.get('page');
	},
	
	defaults: {
		content: '',
		page: 'about'
	}
});