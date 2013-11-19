//LoadingBarView.js

var _ = require('underscore'),
	Backbone = require('backbone');

exports = module.exports = Backbone.View.extend({
	tagName: 'div',
	className: 'loading-bar',

	//Custom attributes
	vent: {},
	percent: 0,
	delay: 800,

	initialize: function(options) {
		_.bindAll(this, 'updateProgress', 'showLoadingBar', 'hideLoadingBar');

		this.vent = options.vent;
		this.vent.on('loadingbar:start', this.showLoadingBar);
		this.vent.on('loadingbar:progress', this.updateProgress);
		this.vent.on('loadingbar:complete', this.hideLoadingBar);
	},

	updateProgress: function(args) {
		this.percent = (args.loaded / args.total) * 100;

		this.$el.css({'width': this.percent + '%'});
	},

	showLoadingBar: function() {
		this.percent = 1;
		this.$el.css({'width': this.percent + '%'}).show();
	},

	hideLoadingBar: function(args) {
		this.$el.fadeOut(this.delay, (function() {
			this.percent = 0;
			this.$el.width(this.percent);
		}).bind(this));
	}
});