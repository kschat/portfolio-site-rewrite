var expect = require('chai').expect,
	sinon = require('sinon'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	Router = require('AppRouter');

describe('AppRouter', function() {
	var vent = _.extend({}, Backbone.Events),
		router = new Router({ vent: vent }),
		pushStateSpy;

	beforeEach(function() {
		try {
			Backbone.history.start({silent: true, pushState: true});
		}
		catch(ex) {}

		sinon.spy(router, 'about');
		sinon.spy(router, 'projects');
		sinon.spy(router, 'resume');
		sinon.spy(router, 'blog');

		sinon.spy(vent, 'trigger');
	});

	afterEach(function() {
		router.about.restore();
		router.projects.restore();
		router.resume.restore();
		router.blog.restore();

		vent.trigger.restore();
	});

	it('has a "vent" object at construction', function() {
		expect(router.options).to.exist;
		expect(router.options.vent).to.exist;
	});

	it('has the "about" route', function() {
		expect(router.routes['']).to.equal('about');
		expect(router.routes['about']).to.equal('about');
	});

	it('triggers the "about" route', function() {
		pushStateSpy = sinon.stub(window.history, 'pushState', function(data, title, url) {
			expect(url).to.match(/^\/(about)?$/);
			router.about();
		});

		router.navigate('');
		router.navigate('about');

		expect(pushStateSpy.calledTwice).to.be.true;
		expect(router.about.calledTwice).to.be.true;
		expect(vent.trigger.withArgs('route:about').calledTwice).to.be.true;

		pushStateSpy.restore();
	});

	it('has the "projects" route', function() {
		expect(router.routes['projects']).to.equal('projects');
	});

	it('triggers the "projects" route', function() {
		pushStateSpy = sinon.stub(window.history, 'pushState', function(data, title, url) {
			expect(url).to.equal('/projects');
			router.projects();
		});

		router.navigate('projects');

		expect(pushStateSpy.calledOnce).to.be.true;
		expect(router.projects.calledOnce).to.be.true;
		expect(vent.trigger.withArgs('route:projects').calledOnce).to.be.true;

		pushStateSpy.restore();
	});

	it('has the "resume" route', function() {
		expect(router.routes['resume']).to.equal('resume');
	});

	it('triggers the "resume" route', function() {
		pushStateSpy = sinon.stub(window.history, 'pushState', function(data, title, url) {
			expect(url).to.equal('/resume');
			router.resume();
		});

		router.navigate('resume');

		expect(pushStateSpy.calledOnce).to.be.true;
		expect(router.resume.calledOnce).to.be.true;
		expect(vent.trigger.withArgs('route:resume').calledOnce).to.be.true;

		pushStateSpy.restore();
	});

	it('has the "blog" route', function() {
		expect(router.routes['blog']).to.equal('blog');
	});

	it('triggers the "blog" route', function() {
		pushStateSpy = sinon.stub(window.history, 'pushState', function(data, title, url) {
			expect(url).to.equal('/blog');
			router.blog();
		});

		router.navigate('blog');

		expect(pushStateSpy.calledOnce).to.be.true;
		expect(router.blog.calledOnce).to.be.true;
		expect(vent.trigger.withArgs('route:blog').calledOnce).to.be.true;

		pushStateSpy.restore();
	});
});