var fs = require('fs');

exports.init = function init(app) {
	app.get(/^\/(about|projects|resume|blog)?$/, function(req, res) {
		var content = fs.readFileSync('views/' + (req.params[0] || 'about') + '.ejs', 'utf-8');

		if(req.xhr) {
			res.send({ content: content });
		}
		else {
			res.render('index', { content: content, env: app.get('env').toUpperCase() });
		}
	});
};