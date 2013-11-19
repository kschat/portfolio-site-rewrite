//PanelModel.js

var _ = require('underscore'),
	Backbone = require('backbone');

exports = module.exports = Backbone.Model.extend({
	urlRoot: '/',
	defaults: {
		content: ''
	},
	// fetch: function(options) {
	// 	return Backbone.Collection.prototype.fetch.call(this, options);
	// }
});