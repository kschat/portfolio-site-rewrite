var expect = require('chai').expect,
	sinon = require('sinon'),
	$ = require('jQuery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	PanelModel = require('PanelModel'),
	PanelView = require('PanelView');

describe('PanelView', function() {
	beforeEach(function() {
		this.vent = _.extend({}, Backbone.Events);

		this.panelLoadStartSpy = sinon.spy(PanelView.prototype, 'onPanelLoadStart');
		this.onPanelLoadCompleteSpy = sinon.spy(PanelView.prototype, 'onPanelLoadComplete');
		this.onPanelLoadErrorSpy = sinon.spy(PanelView.prototype, 'onPanelLoadError');

		this.ajaxStub = sinon.stub($, 'ajax');

		this.model = new PanelModel({ page: 'about' });
		this.view = new PanelView({ 
			model: this.model,
			vent: this.vent, 
			el: '<div class="panel"><div class="error"><p></p></div></div>'
		});
	});

	afterEach(function() {
		this.panelLoadStartSpy.restore();
		this.onPanelLoadCompleteSpy.restore();
		this.onPanelLoadErrorSpy.restore();
		this.ajaxStub.restore();
	});

	it('has constructed correctly', function() {
		expect(this.view.model).to.equal(this.model);
		expect(this.view.vent).to.equal(this.vent);
		expect(this.view.tagName).to.equal('div');
		expect(this.view.className).to.equal('panel');
	});

	it('calls onPanelLoadStart() when "panel:loadStart" is triggered', function() {
		this.vent.trigger('panel:loadStart', { sender: 'about' });
		
		expect(this.panelLoadStartSpy.calledWith({ sender: 'about' })).to.be.true;
	});

	it('Sets the html of the view to the response from the server', function() {
		this.ajaxStub.yieldsTo('success', {
			content: 'about content'
		});

		this.vent.trigger('panel:loadStart', { sender: 'about' });

		expect(this.onPanelLoadCompleteSpy.calledOnce).to.be.true;
		expect(this.view.$el.html()).to.equal('about content');
	});

	it('Raises an "error" event when the server errors', function() {
		this.ajaxStub.yieldsTo('error', { error: 'Error loading page' });

		this.vent.trigger('panel:loadStart', { sender: 'about' });

		expect(this.onPanelLoadErrorSpy.calledOnce).to.be.true;
		expect(this.view.$el.find('.error > p').html()).to.equal('Error loading page');
	});
});