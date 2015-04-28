'use strict';

var https = require('https')
  , http = require('http')
  , Promise = require('bluebird')

  , RequestAsync = Promise.method(function(options) {
      var isHttps = typeof options === 'string' || options instanceof string
            ? /^https:\/\//i.test(options)
            : !!(options || {}).https

        , protocol = isHttps
            ? https
            : http;

      return new Promise(function(resolve, reject) {
        var request = protocol.request(options, function(response) {
          response.body = '';

          response.on('data', function(chunk) {
            response.body += chunk;
          });

          response.on('end', resolve.bind(null, response));
        });

        request.on('error', reject);

        request.end();
      });
    });

module.exports = RequestAsync;
