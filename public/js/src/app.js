;(function(global, undefined) {
    'use strict';

    var _ = require('underscore'),
    	Backbone = require('backbone'),
    	$ = require('jQuery'),
    	AppRouter = require('AppRouter');

    var App = {};

    App.vent = _.extend({}, Backbone.Events);
    App.router = new AppRouter();

    Backbone.history.start({pushState: true});

    $(document).on('click', 'a[data-bypass]', function(e) {
    	var href = $(this).attr('href'),
    		protocol = this.protocol + '//';

    	if(href.slice(protocol.length) !== protocol) {
    		e.preventDefault();
    		App.router.navigate(href, true);
    	}
    });
})(window);