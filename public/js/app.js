;(function(undefined) {
    'use strict'

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    var Canvas = function(width, height) {
        var _canvas = document.getElementsByTagName('canvas')[0],
            _ctx = _canvas.getContext('2d'),
            _entities = [],
            _width = width,
            _height = height;

        setSize(_width, _height);

        function clear() {
            _ctx.clearRect(0, 0, _width, _height);
        }

        function draw() {
            clear();
            for(var i=0; i<_entities.length; i++) {
                _entities[i].draw.call(_ctx, _canvas);
            }

            update();
            requestAnimFrame(draw);
        }

        function update() {
            var newEntities = [];

            for(var i=0; i<_entities.length; i++) {
                if(!_entities[i].dripping() && !_entities[i].replaced) {
                    _entities[i].replaced = true;
                    newEntities.push(spawnStream(randomNumber(1, streamAmt)));
                }
            }

            for(var i=0; i<newEntities.length; i++) {
                addEntity(newEntities[i]);
            }

            if(_entities.length > 300) {
                _entities.shift();
            }
        }

        function setSize(width, height) {
            _canvas.width = width;
            _canvas.height = height;

            clear();
            draw();
        }

        function addEntity(entity) {
            _entities.push(entity);
        }

        function setEntities(entities) {
            _entities = entities;
        }

        return {
            draw: draw,
            setSize: setSize,
            addEntity: addEntity,
            setEntities: setEntities
        };
    };

    var Point = function(x, y) {
        return {
            x: x,
            y: y
        };
    };

    var Stream = function(startPoint, endPoint, speed, width, color) {
        var _startPoint = startPoint,
            _endPoint = endPoint,
            _speed = speed,
            _dripping = true,
            _replaced = false;

        function draw(canvas) {
            this.beginPath();
            this.lineWidth = width;
            this.lineCap = 'round';
            this.strokeStyle = color;

            this.moveTo(_startPoint.x, _startPoint.y);
            this.lineTo(_endPoint.x, _endPoint.y);
            this.stroke();
            this.closePath();

            if(_endPoint.y < canvas.height) { 
                drip(0, _speed); 
            }
            else {
                _dripping = false;
            }
        }

        function drip(dripX, dripY) {
            _endPoint.x += dripX;
            _endPoint.y += dripY;
        }

        function dripping() {
            return _dripping;
        }

        return {
            draw: draw,
            dripping: dripping,
            replaced: _replaced
        };
    };

    var streamAmt = 30,
        streams = [],
        colors = ['#333', '#fff'],
        spacing = 40,
        margin = 0,
        streamWidth = 40,
        topSpeed = 3,
        canvasContainer = null,
        canvas = null;

    for(var i=0; i<streamAmt; i++) {
        streams[i] = spawnStream(randomNumber(1, streamAmt));
    }

    function spawnStream(position) {
        var randomSpacing = randomNumber(spacing + randomNumber(80, 1), spacing);

        return Stream(Point(margin + position * randomSpacing, 1), 
            Point(margin + position * randomSpacing, 1), 
            randomNumber(topSpeed, 1),
            randomNumber(streamWidth, 20),
            colors[randomNumber(colors.length, 0)]);
    }

    function randomNumber(btm, top) {
        return Math.floor((Math.random() * (top-btm)) + btm);
    }

    function randomColor()
    {
        return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
            (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);
    }

    window.onload = function() {
        canvasContainer = document.getElementsByClassName('background-panel')[0],
        canvas = Canvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
        canvas.setEntities(streams);

        window.addEventListener('resize', canvas.setSize.bind(canvas, canvasContainer.clientWidth, canvasContainer.clientHeight), false);
    };
})();