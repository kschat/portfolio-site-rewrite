var expect = require('chai').expect,
	sinon = require('sinon'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	SearchFormView = require('SearchFormView'),
    SearchItemList = require('SearchItemList');

describe('SearchFormView', function() {
	beforeEach(function() {
		this.vent = _.extend({}, Backbone.Events);

		this.showSearchFormSpy = sinon.spy(SearchFormView.prototype, 'showSearchForm');
		this.hideSearchFormSpy = sinon.spy(SearchFormView.prototype, 'hideSearchForm');
		this.makeSearchRequestSpy = sinon.spy(SearchFormView.prototype, 'makeSearchRequest');
		this.searchTextChangedSpy = sinon.spy(SearchFormView.prototype, 'searchTextChanged');

		this.ventTriggerSpy = sinon.spy(this.vent, 'trigger');
		this.clock = sinon.useFakeTimers();
		this.ajaxStub = sinon.stub($, 'ajax');

		this.searchItems = new SearchItemList();

		this.view = new SearchFormView({ 
			vent: this.vent, 
			el: '<form class="search">' +
                    '<span class="search-overlay">' +
                        '<a id="search-button" href="search"></a>' +
                        '<input class="search-box" type="text" placeholder="Search" />' +
                    '</span>' +
                '</form>',
            searchItems: this.searchItems
        });
	});

	afterEach(function() {
		this.showSearchFormSpy.restore();
		this.hideSearchFormSpy.restore();
		this.makeSearchRequestSpy.restore();
		this.searchTextChangedSpy.restore();

		this.ventTriggerSpy.restore();
		this.clock.restore();
		this.ajaxStub.restore();
	});

	it('is shown when the search button is clicked', function() {
		this.view.$el.find('#search-button').trigger('click');

		expect(this.showSearchFormSpy.calledOnce).to.be.true;
		expect(this.view.$el.hasClass('search-active')).to.be.true;
	});

	it('is hidden when the search textbox loses focus', function() {
		var $searchBox = this.view.$el.find('.search-box').blur();

		expect(this.hideSearchFormSpy.calledOnce).to.be.true;
		expect($searchBox.width()).to.equal(0);
	});

	it('triggers a search request after the user has stopped typing for 2 seconds', function() {
		this.ajaxStub.yieldsTo('success');
		this.view.$el.find('.search-box').trigger('keyup');

		expect(this.makeSearchRequestSpy.calledOnce).to.be.false;

		this.clock.tick(500);

		expect(this.makeSearchRequestSpy.calledOnce).to.be.false;

		this.clock.tick(1500);

		expect(this.searchTextChangedSpy.calledOnce).to.be.true;
		expect(this.makeSearchRequestSpy.calledOnce).to.be.true;
		expect(this.ajaxStub.calledOnce).to.be.true;

		this.view.$el.find('.search-box').trigger('keyup');

		this.clock.tick(1000);

		this.view.$el.find('.search-box').trigger('keyup');

		this.clock.tick(1500);

		expect(this.makeSearchRequestSpy.calledTwice).to.be.false;

		this.clock.tick(500);

		expect(this.makeSearchRequestSpy.calledTwice).to.be.true;
		expect(this.searchTextChangedSpy.calledThrice).to.be.true;
		expect(this.ajaxStub.calledTwice).to.be.true;
	});

	it('returns a list of SearchItems based on the query', function() {
		this.ajaxStub.yieldsTo('success', [
			{ id: 0, type: 'project', title: 'title 1', description: 'description 1' },
			{ id: 1, type: 'blog', title: 'title 2', description: 'description 2' }
		]);

		this.vent.trigger('search:send', {});

		expect(this.view.searchItems.length).to.equal(2);
		expect(this.view.searchItems.get(0).get('title')).to.equal('title 1');
	});

	it('triggers "search:error" if an error occured during search request', function() {
		this.ajaxStub.yieldsTo('error', {});

		this.vent.trigger('search:send', {});

		expect(this.ventTriggerSpy.withArgs('search:error').calledOnce).to.be.true;
	});

	it('should consturct a url based on the text in the search box', function() {
		this.ajaxStub.yieldsTo('success');
		
		this.view.$el.find('.search-box').val('test query').trigger('keyup');
		this.clock.tick(2000);

		expect(this.view.searchItems.url()).to.equal('/api/search?q=test query');
	});
});