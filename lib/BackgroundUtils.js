"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyleRulesForClassName = exports.getStyleRules = exports.getBackgroundStylesForSingleClass = exports["default"] = void 0;
var _SimpleUtils = require("./SimpleUtils");
/**
 * Gets styles by a class name.
 *
 * @notice The className has to exactly match the CSS class
 * @param className string
 */

/**
 * Gets styles rules by a class name.
 *
 * @notice The className has to exactly match the CSS class
 * @param className string
 */
var getStyleRulesForClassName = function getStyleRulesForClassName(className) {
  var styleSheets = (0, _SimpleUtils.isBrowser)() ? window.document.styleSheets : [];
  for (var i = 0; i < styleSheets.length; i++) {
    var classes = void 0;
    try {
      classes = typeof styleSheets[i].rules !== 'undefined' ? styleSheets[i].rules : typeof styleSheets[i].cssRules !== 'undefined' ? styleSheets[i].cssRules : '';
    } catch (e) {}
    if (classes) {
      var foundClass = Array.prototype.slice.call(classes).reduce(function (foundAcc, styleRule) {
        if (styleRule.selectorText === className) {
          foundAcc.push(styleRule);
        }
        return foundAcc;
      }, []);
      if (foundClass.length) {
        return foundClass;
      }
    }
  }
  return [];
};

/**
 * Fixes non-enumerable style rules in Firefox.
 *
 * @param cssStyleRules CSSStyleRules   DOM-StyleRules-Object
 * @return {*}
 */
exports.getStyleRulesForClassName = getStyleRulesForClassName;
var getStyleRules = function getStyleRules(cssStyleRules) {
  var styles = {};
  if (cssStyleRules.length > 0 && typeof cssStyleRules[0].style !== 'undefined') {
    // Fallback for Browsers without constructor.name (IE11).
    var constructorName = cssStyleRules[0].style.constructor.name || cssStyleRules[0].style.constructor.toString();
    switch (constructorName) {
      // For Firefox or IE11.
      case 'CSS2Properties':
      case '[object MSStyleCSSProperties]':
        Object.values(cssStyleRules[0].style).forEach(function (prop) {
          styles[(0, _SimpleUtils.toCamelCase)(prop)] = cssStyleRules[0].style[prop];
        });
        break;
      case 'CSSStyleDeclaration':
        styles = cssStyleRules[0].style;
        break;
      default:
        console.error('Unknown style object prototype');
        break;
    }
  }
  return styles;
};

/**
 * Filters out Background Rules for a given class Name.
 *
 * @param className   string    The class to filter rules from
 * @return {{}}
 */
exports.getStyleRules = getStyleRules;
var getBackgroundStylesForSingleClass = function getBackgroundStylesForSingleClass(className) {
  if (className && (0, _SimpleUtils.isString)(className)) {
    var cssStyleRules = getStyleRulesForClassName(".".concat(className));
    // const cssStyleRules = rulesForCssText(style)

    if ((cssStyleRules === null || cssStyleRules === void 0 ? void 0 : cssStyleRules.length) > 0 && typeof cssStyleRules[0].style !== 'undefined') {
      // Filter out background(-*) rules that contain a definition.
      return Object.keys(getStyleRules(cssStyleRules)).filter(function (key) {
        return key.indexOf('background') === 0 && cssStyleRules[0].style[key] !== '';
      }).reduce(function (newData, key) {
        newData[(0, _SimpleUtils.toCamelCase)(key)] = cssStyleRules[0].style[key];
        return newData;
      }, {});
    }
  }
  return {};
};

/**
 * Uses the above to get all background(-*) rules from given class(es).
 *
 * @param className   string|array    className or array of classNames
 * @return {*}
 */
exports.getBackgroundStylesForSingleClass = getBackgroundStylesForSingleClass;
var getBackgroundStyles = function getBackgroundStyles(className) {
  //if (isBrowser()) {
  var classes = (0, _SimpleUtils.stringToArray)(className);
  if (classes instanceof Array) {
    var classObjects = [];
    classes.forEach(function (item) {
      return classObjects.push(getBackgroundStylesForSingleClass(item));
    });
    return Object.assign.apply(Object, classObjects);
  }
  return getBackgroundStylesForSingleClass(className);
  //}
  //return {};
};
var _default = getBackgroundStyles;
exports["default"] = _default;