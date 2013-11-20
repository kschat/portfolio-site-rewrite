//SearchFormView.js

var _ = require('underscore'),
	Backbone = require('backbone'),
	SearchItemList = require('SearchItemList');

exports = module.exports = Backbone.View.extend({
	tagName: 'form',
	className: 'search',

	//Custom attributes
	vent: {},
	searchTimeout: 0,

	initialize: function(options) {
		_.bindAll(this, 
			'showSearchForm', 'hideSearchForm', 'searchTextChanged', 'makeSearchRequest', 
			'searchSuccess', 'searchError');

		this.searchItems = options.searchItems;
		this.vent = options.vent;
		this.vent.on('search:send', this.makeSearchRequest);
	},

	render: function() {
		return this;
	},

	events: {
		'click #search-button': 'showSearchForm',
		'blur .search-box': 'hideSearchForm',
		'keyup .search-box': 'searchTextChanged'
	},

	showSearchForm: function(e) {
		e.preventDefault();
		
		this.$el.addClass('search-active')
			.find('.search-box')
			.focus();
	},

	hideSearchForm: function(e) {
		this.$el.removeClass('search-active');
	},

	searchTextChanged: function(e) {
		clearTimeout(this.searchTimeout);
		this.searchTimeout = setTimeout((function() { 
			this.vent.trigger('search:send', { query: $(e.target).val().trim() });
		}).bind(this), 3000);
	},

	makeSearchRequest: function(args) {
		this.searchItems.query = args.query;
		this.searchItems.fetch({
			success: this.searchSuccess,
			error: this.searchError
		});
	},

	searchSuccess: function(model, response) {
		this.vent.trigger('search:success', { model: model, response: response });
	},

	searchError: function(model, response) {
		this.vent.trigger('search:error', { model: model, response: response });
	}
});