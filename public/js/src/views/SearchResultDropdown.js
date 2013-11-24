//SearchResultDropdown.js

var _ = require('underscore'),
	Backbone = require('backbone');

exports = module.exports = Backbone.View.extend({
	tagName: 'div',
	className: 'search-results-overlay',

	//Custom attributes
	vent: {},

	initialize: function(options) {
		_.bindAll(this, 'render', 'displayResults', 'displayDropdown', 'hideDropdown', '_generateListTitle', '_generateListItem');

		this.$closeBtn = this.$el.find('#search-close-btn');
		this.$searchLabel = this.$el.find('#search-results-label');
		this.$resultsList = this.$el.find('.search-overlay-list');

		this._titles = [];

		this.vent = options.vent;
		this.vent.on('search:active', this.displayDropdown);
		this.vent.on('search:inactive', this.hideDropdown);
		this.vent.on('search:success', this.displayResults);

		console.log(this.$el, this.$resultsList);
	},

	render: function() {
		return this;
	},

	events: {
		'click #search-close-btn': 'hideDropdown'
	},

	displayResults: function(args) {
		var results = _.sortBy(args.model.searchList, 'type');

		this.$resultsList.html('');

		if(results.length === 0) {
			this.$searchLabel.text('No results found');
			return;
		}

		this.$searchLabel.text('');

		for(var i=0; i<results.length; i++) {
			var result = results[i];

			if(!_.contains(this._titles, result.type)) {
				this._titles.push(result.type);
				this.$resultsList.append(this._generateListTitle(result.type));
			}

			this.$resultsList.append(this._generateListItem(result.title, result.description));
		}
	},

	displayDropdown: function() {
		this.$searchLabel.text('Search projects and blog posts');
		this.$el.addClass('in');
		this.$el.removeClass('out');
	},

	hideDropdown: function(e) {
		if(e) { e.preventDefault(); }
		this.$el.addClass('out');
		this.$el.removeClass('in');
	},

	_generateListTitle: function(title) {
		return _.template('<li class="list-title"><a href="#"><h3><%=title %></h3></a></li>', { title: title });
	},

	_generateListItem: function(title, content) {
		return _.template('<li><a href="#"><h4><%=title %></h4><p class="list-description"><%=content %></p></a></li>',
			 { title: title, content: content });
	}
});