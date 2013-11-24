//SearchItemList.js

var _ = require('underscore'),
	Backbone = require('backbone'),
	SearchItem = require('SearchItem');

exports = module.exports = Backbone.Collection.extend({
	model: SearchItem,
	query: '',
	url: function() {
		console.log(this.query);
		return '/api/search?q=' + this.query;
	}
});