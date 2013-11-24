var fs = require('fs');

exports.init = function init(app) {
	app.get(/\/api\/search/, function(req, res) {
		console.log(req.param('q'));
		res.send([]);
	});
};