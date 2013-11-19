var expect = require('chai').expect,
	sinon = require('sinon'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	LoadingBarView = require('LoadingBarView');

describe('LoadingBarView', function() {
	beforeEach(function() {
		this.vent = _.extend({}, Backbone.Events);

		this.updateProgressSpy = sinon.spy(LoadingBarView.prototype, 'updateProgress');
		this.showLoadingBarSpy = sinon.spy(LoadingBarView.prototype, 'showLoadingBar');
		this.hideLoadingBarSpy = sinon.spy(LoadingBarView.prototype, 'hideLoadingBar');

		this.view = new LoadingBarView({ vent: this.vent, el: '<div class="loading-bar"></div>' });
	});

	afterEach(function() {
		this.updateProgressSpy.restore();
		this.showLoadingBarSpy.restore();
		this.hideLoadingBarSpy.restore();
	});

	it('updates the progress bar width everytime "loadingbar:progress" is fired', function() {
		this.vent.trigger('loadingbar:progress', { loaded: 1, total: 100 });

		expect(this.updateProgressSpy.calledOnce).to.be.true;
		expect(this.view.percent).to.equal(1);

		this.vent.trigger('loadingbar:progress', { loaded: 25, total: 100 });

		expect(this.updateProgressSpy.calledTwice).to.be.true;
		expect(this.view.percent).to.equal(25);

		this.vent.trigger('loadingbar:progress', { loaded: 100, total: 100 });

		expect(this.updateProgressSpy.calledThrice).to.be.true;
		expect(this.view.percent).to.equal(100);
	});

	it('resets the progress bars width to 1 and displays the bar when "loadingbar:start" is fired', function() {
		this.vent.trigger('loadingbar:start');

		expect(this.showLoadingBarSpy.calledOnce).to.be.true;
		expect(this.view.percent).to.equal(1);
	});

	it('hides the progress bar and sets its width to 0 when "loadingbar:complete" is fired', function() {
		this.vent.trigger('loadingbar:complete');

		expect(this.hideLoadingBarSpy.calledOnce).to.be.true;
		expect(this.view.percent).to.equal(0);
	});
});