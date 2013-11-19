//SearchFormView.js

var _ = require('underscore'),
	Backbone = require('backbone');

exports = module.exports = Backbone.View.extend({
	tagName: 'form',
	className: 'search',

	//Custom attributes
	vent: {},

	initialize: function(options) {
		_.bindAll(this, 'showSearchForm', 'hideSearchForm');

		this.id = options.id;
		this.vent = options.vent;
	},

	render: function() {
		return this;
	},

	events: {
		'click #search-button': 'showSearchForm',
		'blur .search-box': 'hideSearchForm'
	},

	showSearchForm: function(e) {
		e.preventDefault();
		
		this.$el.addClass('search-active')
			.find('.search-box')
			.focus();
	},

	hideSearchForm: function(e) {
		this.$el.removeClass('search-active');
	}
});