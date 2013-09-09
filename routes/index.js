
/*
 * GET home page.
 */
exports.init = function init(app) {
  app.get('/', function(req, res) {
  	res.render('index', { title: 'express' });
  });
};