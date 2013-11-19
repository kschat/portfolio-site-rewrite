;(function(global, undefined) {
    'use strict';

    var _ = require('underscore'),
    	$ = require('jQuery'),
    	Backbone = require('backbone'),
    	AppRouter = require('AppRouter'),
    	NavLinkView = require('NavLinkView'),
    	PanelView = require('PanelView'),
    	PanelModel = require('PanelModel'),
    	LoadingBarView = require('LoadingBarView');

    var App = {};
    
    App.vent = _.extend({}, Backbone.Events);
    App.router = new AppRouter({ vent: App.vent });

    App.views = {};

    Backbone.history.start({ pushState: true });

    $(function() {
    	App.views.aboutLink = new NavLinkView({ vent: App.vent, el: 'a#about' });
	    App.views.projectsLink = new NavLinkView({ vent: App.vent, el: 'a#projects' });
	    App.views.resumeLink = new NavLinkView({ vent: App.vent, el: 'a#resume' });
	    App.views.blogLink = new NavLinkView({ vent: App.vent, el: 'a#blog' });
	    App.views.panel = new PanelView({ vent: App.vent, model: new PanelModel(), el: 'div.panel' });
	    App.views.loadingBar = new LoadingBarView({ vent: App.vent, el: 'div.loading-bar' });

	    App.vent.trigger('nav:select', { sender: Backbone.history.fragment || 'about' });
    });

    $(document).on('click', 'a[data-bypass]', function(e) {
    	var href = $(this).attr('href'),
    		protocol = this.protocol + '//';

    	if(href.slice(protocol.length) !== protocol) {
    		e.preventDefault();
    		App.router.navigate(href, true);
    	}
    });
})(window);