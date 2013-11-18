//NavLinkView.js

var _ = require('underscore'),
	Backbone = require('backbone');

exports = module.exports = Backbone.View.extend({
	tagName: 'a',
	className: 'main-nav-button',

	//Custom attributes
	vent: {},

	initialize: function(options) {
		_.bindAll(this, 'onLinkSelected', 'onNavClick');

		this.id = this.$el.attr('id');
		this.vent = options.vent;
		this.vent.on('route:' + this.id, this.onLinkSelected);
		this.vent.on('nav:click', this.onNavClick);
	},

	render: function() {
		return this;
	},

	events: {
		'click': 'onLinkSelected'
	},

	onLinkSelected: function() {
		this.$el.addClass('selected-link');
		this.vent.trigger('nav:click', { sender: this.id });
		this.vent.trigger('panel:loadStart', { sender: this.id });
	},

	onNavClick: function(args) {
		if(args.sender !== this.id) {
			this.$el.removeClass('selected-link');
		}
	}
});