"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTransitionStyles = exports.presetBackgroundStyles = exports.kebabifyBackgroundStyles = exports.fixOpacity = exports.fixClassName = exports.escapeClassNames = void 0;
var _shortUuid = _interopRequireDefault(require("short-uuid"));
var _HelperUtils = require("./HelperUtils");
var _ClassCache = require("./ClassCache");
var _ImageUtils = require("./ImageUtils");
var _SimpleUtils = require("./SimpleUtils");
var _excluded = ["className"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
 * Checks if an element with given className(s) already exists.
 *
 * @param className       string    Given className(s) e.g. from styled-components
 * @param props           Object    Given props by component
 * @return {*[]}
 */
var fixClassName = function fixClassName(_ref) {
  var className = _ref.className,
    props = _objectWithoutProperties(_ref, _excluded);
  // const escapedClassName = escapeClassNames(className)
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  var elementExists = (0, _ClassCache.inComponentClassCache)(className);

  // Extract imageData.
  var imageData = (0, _ImageUtils.getCurrentSrcData)(convertedProps);

  // Add an additional unique class for multiple <BackgroundImage>s.
  var additionalClassname = _shortUuid["default"].generate();

  // Create random "uniquely hashed" additionalClass if needed.
  var randomClass = " gbi-".concat((0, _SimpleUtils.hashString)(imageData && imageData.srcSet || className || "noclass"), "-").concat(additionalClassname);

  // Should an element already exist or have no className, add randomized class.
  var additionalClass = elementExists || !className ? randomClass : "";
  var componentClassNames = "".concat(className || "").concat(additionalClass || "").trim();
  // Add it to cache if it doesn't exist.
  if (!elementExists) (0, _ClassCache.activateCacheForComponentClass)(className);
  return [componentClassNames];
};

/**
 * Escapes specialChars defined in gatsby-config.js in classNames to make
 * Tailwind CSS or suchlike usable (defaults to: `:/`).
 *
 * @param classNames           classNames to escape.
 * @return {void | string|*}
 */
exports.fixClassName = fixClassName;
var escapeClassNames = function escapeClassNames(classNames) {
  /* eslint-disable no-undef */
  if (classNames) {
    var specialChars =
    // eslint-disable-next-line no-undef
    (0, _SimpleUtils.isBrowser)() && window._gbiSpecialChars ? window._gbiSpecialChars : (typeof __GBI_SPECIAL_CHARS__ === "undefined" ? "undefined" : _typeof(__GBI_SPECIAL_CHARS__)) !== "undefined" ? __GBI_SPECIAL_CHARS__ : ':/';
    var specialCharRegEx = new RegExp("[".concat(specialChars, "]"), 'g');
    return classNames.replace(specialCharRegEx, '\\$&');
  }
  return classNames;
  /* eslint-enable no-undef */
};

/**
 * Converts a style object into CSS kebab-cased style rules.
 *
 * @param styles    Object  Style object to convert
 * @return {*}
 */
exports.escapeClassNames = escapeClassNames;
var kebabifyBackgroundStyles = function kebabifyBackgroundStyles(styles) {
  if ((0, _SimpleUtils.isString)(styles)) {
    return styles;
  }
  if (styles instanceof Object) {
    return Object.keys(styles).filter(function (key) {
      return key.indexOf('background') === 0 && styles[key] !== '';
    }).reduce(function (resultingStyles, key) {
      return "".concat(resultingStyles).concat((0, _SimpleUtils.toKebabCase)(key), ": ").concat(styles[key], ";\n");
    }, "");
  }
  return "";
};

/**
 * Creates vendor prefixed background styles.
 *
 * @param transitionDelay   string    Time delay before transitioning
 * @param fadeIn            boolean   Should we transition?
 * @return {string}
 */
exports.kebabifyBackgroundStyles = kebabifyBackgroundStyles;
var setTransitionStyles = function setTransitionStyles() {
  var transitionDelay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "0.25s";
  var fadeIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return fadeIn ? "transition: opacity 0.5s ease ".concat(transitionDelay, ";") : "transition: none;";
};

/**
 * Prevent possible stacking order mismatch with opacity "hack".
 *
 * @param props     Object    Given props by component
 * @return {Object}
 */
exports.setTransitionStyles = setTransitionStyles;
var fixOpacity = function fixOpacity(props) {
  var styledProps = _objectSpread({}, props);
  if (!styledProps.preserveStackingContext) {
    try {
      if (styledProps.style && styledProps.style.opacity) {
        if (isNaN(styledProps.style.opacity) || styledProps.style.opacity > 0.99) {
          styledProps.style.opacity = 0.99;
        }
      }
    } catch (e) {
      // Continue regardless of error
    }
  }
  return styledProps;
};

/**
 * Set some needed backgroundStyles.
 *
 * @param backgroundStyles  object    Special background styles to be spread
 * @return {Object}
 */
exports.fixOpacity = fixOpacity;
var presetBackgroundStyles = function presetBackgroundStyles(backgroundStyles) {
  var defaultBackgroundStyles = {
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  };
  return _objectSpread(_objectSpread({}, defaultBackgroundStyles), backgroundStyles);
};
exports.presetBackgroundStyles = presetBackgroundStyles;