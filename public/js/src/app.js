;(function(global, undefined) {
  'use strict';

  var _ = require('underscore')
    , $ = require('jQuery')
    , Backbone = require('backbone')
    , AppRouter = require('AppRouter')
    , NavLinkView = require('NavLinkView')
    , PanelView = require('PanelView')
    , PanelModel = require('PanelModel')
    , LoadingBarView = require('LoadingBarView')
    , SearchFormView = require('SearchFormView')
    , SearchItemList = require('SearchItemList')
    , SearchResultDropdown = require('SearchResultDropdown')

    , App = {};

  App.vent = _.extend({}, Backbone.Events);

  App.views = {};
  App.collections = {};

  App.collections.searchItems = new SearchItemList();

  App.router = new AppRouter({ vent: App.vent });
  Backbone.history.start({ pushState: true, slient: true });

  $(function() {
    App.views.aboutLink = new NavLinkView({ vent: App.vent, el: 'a#about' });
    App.views.projectsLink = new NavLinkView({ vent: App.vent, el: 'a#projects' });
    App.views.resumeLink = new NavLinkView({ vent: App.vent, el: 'a#resume' });
    App.views.blogLink = new NavLinkView({ vent: App.vent, el: 'a#blog' });

    App.views.panel = new PanelView({ vent: App.vent, model: new PanelModel(), el: 'div.background-panel' });
    App.views.loadingBar = new LoadingBarView({ vent: App.vent, el: 'div.loading-bar' });

    App.views.searchForm = new SearchFormView({ vent: App.vent, el: 'form.search', searchItems: App.collections.searchItems });
    App.views.searchDropdown = new SearchResultDropdown({ vent: App.vent, el: '.search-results-overlay' });

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