"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenToIntersections = exports.getIO = exports.callbackIO = void 0;
var _SimpleUtils = require("./SimpleUtils");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var io;
var listeners = new WeakMap();

/**
 * Executes each IntersectionObserver entries' callback.
 *
 * @param entries
 */
var callbackIO = function callbackIO(entries) {
  entries.forEach(function (entry) {
    if (listeners.has(entry.target)) {
      var callback = listeners.get(entry.target);
      // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        io.unobserve(entry.target);
        listeners["delete"](entry.target);
        callback();
      }
    }
  });
};

/**
 * Returns an IntersectionObserver instance if exists.
 *
 * @param rootMargin    string    The current rootMargin, defaults to 200px.
 * @return {IntersectionObserver|undefined}
 */
exports.callbackIO = callbackIO;
var getIO = function getIO(rootMargin) {
  if (_typeof(io) === "undefined" && (0, _SimpleUtils.isBrowser)() && window.IntersectionObserver) {
    io = new window.IntersectionObserver(callbackIO, {
      rootMargin: rootMargin
    });
  }
  return io;
};

/**
 * Registers IntersectionObserver callback on element.
 *
 * @param element     Element   The element to observe.
 * @param callback    function  Callback to call when intersecting.
 * @param rootMargin  string    The current rootMargin, defaults to 200px.
 * @return {Function}
 */
exports.getIO = getIO;
var listenToIntersections = function listenToIntersections(element, callback) {
  var rootMargin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "200px";
  var observer = getIO(rootMargin);
  if (observer) {
    observer.observe(element);
    listeners.set(element, callback);
    return function () {
      observer.unobserve(element);
      listeners["delete"](element);
    };
  }
  return function () {};
};
exports.listenToIntersections = listenToIntersections;