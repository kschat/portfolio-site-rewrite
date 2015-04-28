//PanelView.js

'use strict';

var _ = require('underscore')
	, Backbone = require('backbone');

exports = module.exports = Backbone.View.extend({
	tagName: 'div',
	className: 'background-panel',

	//Custom attributes
	vent: {},

	initialize: function(options) {
		_.bindAll(this, 'setupXhr', 'onPanelLoadStart', 'onPanelLoadComplete', 'onPanelLoadError');

		this.vent = options.vent;
		this.vent.on('panel:loadStart', this.onPanelLoadStart);
	},

	render: function() {
		return this;
	},

	setupXhr: function() {
		var xhr = new XMLHttpRequest();

		xhr.addEventListener('progress', (function(evt) {
			if(!evt.lengthComputable) { return; }

			this.vent.trigger('loadingbar:progress', {
				loaded: evt.loaded,
				total: evt.total
			});
		}).bind(this), false);

		return xhr;
	},

	onPanelLoadStart: function(args) {
		this.vent.trigger('loadingbar:start');

		this.model.set('page', args.sender);
		this.model.fetch({
			xhr: this.setupXhr,
			success: this.onPanelLoadComplete,
			error: this.onPanelLoadError
		});
	},

	onPanelLoadComplete: function(model, response) {
		this.$el.fadeOut(function() {
			this.$el.html(response.content);
			this.$el.fadeIn();
		}.bind(this));

		this.vent.trigger('loadingbar:complete');
		this.vent.trigger('nav:select', { sender: this.model.get('page') });
	},

	onPanelLoadError: function(model, response) {
		this.$el.find('.error > p').html(response.error);

		this.vent.trigger('loadingbar:complete');
	}
});