"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toKebabCase = exports.toCamelCase = exports.stringToArray = exports.isString = exports.isObject = exports.isBrowser = exports.hashString = exports.filteredJoin = exports.combineArray = exports.capitalize = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/**
 * Are we in the browser?
 *
 * @return {boolean}
 */
var isBrowser = function isBrowser() {
  return (typeof window === "undefined" ? "undefined" : _typeof(window)) !== "undefined" && _typeof(window.document) !== "undefined";
};

/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */
exports.isBrowser = isBrowser;
var isString = function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
};

/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */
exports.isString = isString;
var isObject = function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
};

/**
 * Converts CSS kebab-case strings to camel-cased js style rules.
 *
 * @param str   string    Rule to transform
 * @return {boolean|string}
 */
exports.isObject = isObject;
var toCamelCase = function toCamelCase(str) {
  return isString(str) && str.indexOf('-') !== -1 && str.toLowerCase().replace(/(?:^\w|-|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s|\W+/g, '') || str;
};

/**
 * Converts camel-cased js style rules to CSS kebab-case strings.
 *
 * @param {string}  str    Rule to transform
 * @return {boolean|string}
 */
exports.toCamelCase = toCamelCase;
var toKebabCase = function toKebabCase(str) {
  return isString(str) && str.replace(/\s|\W+/g, '').replace(/[A-Z]/g, function (match) {
    return "-".concat(match.toLowerCase());
  });
};

/**
 * Capitalizes first Char.
 *
 * @param {string}  str   Word to capitalize.
 * @returns {string}
 */
exports.toKebabCase = toKebabCase;
var capitalize = function capitalize(str) {
  return (str === null || str === void 0 ? void 0 : str.charAt(0).toUpperCase()) + str.slice(1);
};

/**
 * Splits a given string (e.g. from classname) to an array.
 *
 * @param str string|array  String to split or return as array
 * @param delimiter string  Delimiter on which to split str
 * @return {array|boolean}  Returns (split) string as array, false on failure
 */
exports.capitalize = capitalize;
var stringToArray = function stringToArray(str) {
  var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : " ";
  if (str instanceof Array) {
    return str;
  }
  if (isString(str)) {
    if (str.includes(delimiter)) {
      return str.split(delimiter);
    }
    return [str];
  }
  return false;
};

/**
 * Hashes a String to a 32bit integer with the simple Java 8 hashCode() func.
 *
 * @param str   string    String to hash.
 * @return {number}
 */
exports.stringToArray = stringToArray;
var hashString = function hashString(str) {
  return isString(str) && [].reduce.call(str, function (hash, item) {
    hash = (hash << 5) - hash + item.charCodeAt(0);
    return hash | 0;
  }, 0);
};

/**
 * As the name says, it filters out empty strings from an array and joins it.
 *
 * @param arrayToJoin   array   Array to join after filtering.
 * @return {string}
 */
exports.hashString = hashString;
var filteredJoin = function filteredJoin(arrayToJoin) {
  return arrayToJoin.filter(function (item) {
    return item !== "";
  }).join();
};

/**
 * Combines two arrays while keeping fromArrays indexes & values.
 *
 * @param fromArray   array   Array the values shall be taken from.
 * @param toArray     array   Array to copy values into.
 * @return {array}
 */
exports.filteredJoin = filteredJoin;
var combineArray = function combineArray(fromArray, toArray) {
  // Fallback for singular images.
  if (!Array.isArray(fromArray)) {
    return [fromArray];
  }
  return fromArray.map(function (item, index) {
    return item || toArray && toArray[index];
  });
};
exports.combineArray = combineArray;