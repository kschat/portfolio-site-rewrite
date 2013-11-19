var expect = require('chai').expect,
	sinon = require('sinon'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	NavLinkView = require('NavLinkView');

describe('NavLinkView', function() {
	beforeEach(function() {
		this.vent = _.extend({}, Backbone.Events);

		this.linkSelectedSpy = sinon.spy(NavLinkView.prototype, 'onLinkSelected');

		this.view = new NavLinkView({ vent: this.vent, id: 'about' });
	});

	afterEach(function() {
		this.linkSelectedSpy.restore();
	});

	it('has constructed correctly', function() {
		expect(this.view.vent).to.equal(this.vent);
		expect(this.view.id).to.equal('about');
	});

	it('returns itself when render() is called', function() {
		expect(this.view.render()).to.equal(this.view);
	});

	it('calls onLinkSelected() when "route:about" is triggered', function() {
		this.vent.trigger('route:about');

		expect(this.linkSelectedSpy.calledOnce).to.be.true;
	});

	it('calls onLinkSelected() when clicked', function() {
		this.view.$el.trigger('click');

		expect(this.linkSelectedSpy.calledOnce).to.be.true;
	});

	it('triggers "panel:loadStart" when selected', function() {
		this.vent.trigger('route:about');

		expect(this.linkSelectedSpy.calledOnce).to.be.true;
	});

	it('unselects itself when "nav:click" is sent from another link', function() {
		this.vent.trigger('nav:click', { sender: 'other' });

		expect(this.view.$el.hasClass('selected-link')).to.be.false;
	});

	it('selects itself when "nav:select" is sent and contains its id', function() {
		this.vent.trigger('nav:select', { sender: 'about' });

		expect(this.view.$el.hasClass('selected-link')).to.be.true;
	});
});