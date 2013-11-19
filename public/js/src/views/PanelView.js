//PanelView.js

var _ = require('underscore'),
	Backbone = require('backbone');

exports = module.exports = Backbone.View.extend({
	tagName: 'div',
	className: 'panel',

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
		var xhr = new window.XMLHttpRequest();

		xhr.addEventListener('progress', (function(evt) {
			if(evt.lengthComputable) {
				this.vent.trigger('loadingbar:progress', {
					loaded: evt.loaded,
					total: evt.total
				});
			}
		}).bind(this), false);

		return xhr;
	},

	onPanelLoadStart: function(args) {
		this.vent.trigger('loadingbar:start');
		
		this.model.url = '/' + args.sender;
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
	},

	onPanelLoadError: function(model, response) {
		this.$el.find('.error > p').html(response.error);
	}
});