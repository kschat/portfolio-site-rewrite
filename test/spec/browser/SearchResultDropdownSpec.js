var expect = require('chai').expect,
	sinon = require('sinon'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	SearchResultDropdown = require('SearchResultDropdown');

describe('SearchResultDropdown', function() {
	beforeEach(function() {
		this.vent = _.extend({}, Backbone.Events);

		this.displayDropdownSpy = sinon.spy(SearchResultDropdown.prototype, 'displayDropdown');
		this.hideDropdownSpy = sinon.spy(SearchResultDropdown.prototype, 'hideDropdown');
		this.displayResultsSpy = sinon.spy(SearchResultDropdown.prototype, 'displayResults');


		this.view = new SearchResultDropdown({ 
			vent: this.vent,
			el: '<div class="search-results-overlay" style="display: none;">' +
				'<div class="search-results-container"><a id="search-close-btn" href="#"></a>' +
				'<h2 id="search-results-label"></h2>' +
				'<div class="search-overlay-content"><ul class="search-overlay-list"></ul>' +
				'</div></div>'
		});
	});

	afterEach(function() {
		this.displayDropdownSpy.restore();
		this.hideDropdownSpy.restore();
		this.displayResultsSpy.restore();
	});

	it('displays the dropdown when the search button is clicked', function() {
		this.vent.trigger('search:active');

		expect(this.displayDropdownSpy.calledOnce).to.be.true;
		expect(this.view.$el.hasClass('in')).to.be.true;
		expect(this.view.$el.hasClass('out')).to.be.false;
		expect(this.view.$searchLabel.text()).to.equal('Search projects and blog posts');
	});

	it('hides the dropdown when the close button is clicked', function() {
		this.vent.trigger('search:active');
		this.view.$closeBtn.trigger('click');

		expect(this.hideDropdownSpy.calledOnce).to.be.true;
		expect(this.view.$el.hasClass('in')).to.be.false;
		expect(this.view.$el.hasClass('out')).to.be.true;
	});

	it('hides the dropdown when the search form losses focus', function() {
		this.vent.trigger('search:inactive');

		expect(this.hideDropdownSpy.calledOnce).to.be.true;
		expect(this.view.$el.hasClass('search-results-display')).to.be.false;
	});

	it('displays a message when no results are returned', function() {
		this.vent.trigger('search:active');
		this.vent.trigger('search:success', { model: { searchList: [] } });

		expect(this.view.$searchLabel.text()).to.equal('No results found');
	});

	it('displays results when returned', function() {
		this.vent.trigger('search:success', { 
			model: { 
				searchList: [
					{ type: 'project', title: 'project 1', description: 'first project' },
					{ type: 'blog', title: 'blog 1', description: 'first blog post' },
					{ type: 'project', title: 'project 2', description: 'second project' },
					{ type: 'project', title: 'project 3', description: 'third project' }
				]
			}
		});

		expect(this.displayResultsSpy.calledOnce).to.be.true;
		expect(this.view._titles.length).to.equal(2);
		expect(this.view.$resultsList.find('li').length).to.equal(6);
		expect(this.view.$resultsList.find('.list-title').length).to.equal(2);
		expect(this.view.$resultsList.find('.list-description').length).to.equal(4);
	});
});