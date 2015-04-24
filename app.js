'use strict';

var express = require('express')
	, settings = require('./config/settings.json')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, fs = require('fs')
	, exphbs = require('express-handlebars')
	, assets = require('./middleware/assets')

	, app = express()
	, routeDir = 'routes'
	, routeFiles = fs.readdirSync(routeDir);

// all environments
app.set('port', process.env.PORT || 3000);

app.locals.settings = settings;

app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: 'hbs'
}));

app.set('view engine', '.hbs');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(assets(app.get('env'), settings.assets));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//Gets the path for each file in the routes directory and initiates them
routeFiles.forEach(function(file) {
	var filePath = path.resolve('./', routeDir, file)
		, route = require(filePath);

	route.init(app);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log(app.get('env'));
  console.log('Express server listening on port ' + app.get('port'));
});
