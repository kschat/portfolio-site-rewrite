'use strict';

var DEFAULT_MESSAGE = 'Unknown error'
  , DEFAULT_STATUS = 400;

function ServerError(message, status, props) {
  if(!(this instanceof ServerError)) {
    return new ServerError(message, status, props);
  }

  if(message instanceof Error) {
    return new ServerError(message.message || DEFAULT_STATUS, DEFAULT_STATUS);
  }

  props = props || {};

  Object.keys(props).forEach(function(prop, val) {
    this[prop] = val;
  });

  this.message = message || DEFAULT_MESSAGE;
  this.status = status || DEFAULT_STATUS;
  this.stack = Error().stack;
  props = props || {};
}

ServerError.prototype = Object.create(Error.prototype);

ServerError.prototype.name = 'ServerError';

ServerError.prototype.toString = function() {
  return 'An error occured: ' + this.message;
};

module.exports = ServerError;
