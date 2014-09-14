(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var calling_args, post, queue, send, _i, _len,
  __slice = [].slice;

post = require('./micropost.coffee');

send = function(event, value) {
  var info;
  info = {
    e: event,
    v: value,
    i: window.mai,
    r: document.referrer
  };
  return post('http://microanalytics.alhur.es/track', info, function(text) {
    return console.log(text);
  });
};

queue = window.maq;

window.ma = function() {
  var calling_args;
  calling_args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return send.apply(this, calling_args);
};

for (_i = 0, _len = queue.length; _i < _len; _i++) {
  calling_args = queue[_i];
  send.apply(this, calling_args);
}


},{"./micropost.coffee":2}],2:[function(require,module,exports){
module.exports = function(url, json, callback) {
  var xhr;
  xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (callback) {
        return callback(xhr.responseText);
      }
    }
  };
  xhr.open('POST', url, true);
  xhr.withCredentials = true;
  xhr.setRequestHeader('Content-type', 'application/json');
  return xhr.send(JSON.stringify(json));
};


},{}]},{},[1])