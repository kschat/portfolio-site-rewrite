exports.init = function init(app) {
  app.get(/^\/(?:about|projects|resume|blog)?$/, function(req, res) {
  	res.render('index', { env: app.get('env').toUpperCase() });
  });
};