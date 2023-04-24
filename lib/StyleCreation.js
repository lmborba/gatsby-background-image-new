"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStyleImage = exports.createPseudoStyles = exports.createPseudoElementWithContent = exports.createPseudoElementMediaQuery = exports.createPseudoElement = exports.createNoScriptStyles = void 0;
var _StyleUtils = require("./StyleUtils");
var _ImageUtils = require("./ImageUtils");
var _MediaUtils = require("./MediaUtils");
var _SimpleUtils = require("./SimpleUtils");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Creates pseudo-element(s) for className(s).
 *
 * @param className string  className given by props
 * @param appendix  string  Pseudo-element to create, defaults to `:before`
 * @return {string}
 */
var createPseudoElement = function createPseudoElement(className) {
  var appendix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ":before";
  var escapedClassName = (0, _StyleUtils.escapeClassNames)(className);
  var classes = (0, _SimpleUtils.stringToArray)(escapedClassName);
  var pseudoClasses = "";
  if (Array.isArray(classes)) {
    classes = classes.filter(function (c) {
      return c !== '';
    });
    if (classes.length > 0) {
      pseudoClasses = ".".concat(classes.join('.')).concat(appendix);
    }
  }
  return pseudoClasses;
};

/**
 * Creates a single pseudo-element with image content.
 *
 * @param pseudoElementString   string    The current pseudo-element name.
 * @param imageSource           string    The current image source.
 * @return {string}
 */
exports.createPseudoElement = createPseudoElement;
var createPseudoElementWithContent = function createPseudoElementWithContent(pseudoElementString, imageSource) {
  return "\n    ".concat(pseudoElementString, " {\n      opacity: 1;\n      background-image: ").concat(imageSource, ";\n    }");
};

/**
 * Creates a single pseudo-element media-query.
 *
 * @param pseudoElementString
 * @param media
 * @param imageSource
 * @param imageSourceWebP
 * @return {string}
 */
exports.createPseudoElementWithContent = createPseudoElementWithContent;
var createPseudoElementMediaQuery = function createPseudoElementMediaQuery(pseudoElementString, media, imageSource, imageSourceWebP) {
  return "\n      @media ".concat(media, " {\n        ").concat(createPseudoElementWithContent(pseudoElementString, imageSource), "\n      }\n      ").concat(imageSourceWebP && "@media ".concat(media, " {\n          ").concat(createPseudoElementWithContent(pseudoElementString, imageSourceWebP), "\n        }"), "\n    ");
};

/**
 * Creates styles for the changing pseudo-elements' backgrounds.
 *
 * @param className         string    One or more className(s)
 * @param transitionDelay   string    Time delay before transitioning
 * @param lastImage         string    The last image given
 * @param nextImage         string    The next image to show
 * @param afterOpacity      number    The opacity of the pseudo-element upfront
 * @param bgColor           string    A possible background-color to set
 * @param fadeIn            boolean   Should we transition?
 * @param backgroundStyles  object    Special background styles to be spread
 * @param style             object    Default style to be spread
 * @param finalImage        boolean   Have we reached the last image?
 * @param originalData
 * @return {string}
 */
exports.createPseudoElementMediaQuery = createPseudoElementMediaQuery;
var createPseudoStyles = function createPseudoStyles(_ref) {
  var className = _ref.className,
    transitionDelay = _ref.transitionDelay,
    lastImage = _ref.lastImage,
    nextImage = _ref.nextImage,
    afterOpacity = _ref.afterOpacity,
    bgColor = _ref.bgColor,
    fadeIn = _ref.fadeIn,
    backgroundStyles = _ref.backgroundStyles,
    style = _ref.style,
    finalImage = _ref.finalImage,
    originalData = _ref.originalData;
  var pseudoBefore = createPseudoElement(className);
  var pseudoAfter = createPseudoElement(className, ":after");
  var currentBackgroundStyles = _objectSpread(_objectSpread({}, backgroundStyles), style);
  return "\n          ".concat(pseudoBefore, ",\n          ").concat(pseudoAfter, " {\n            content: '';\n            display: block;\n            position: absolute;\n            width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            ").concat(bgColor && "background-color: ".concat(bgColor, ";"), "\n            ").concat((0, _StyleUtils.setTransitionStyles)(transitionDelay, fadeIn), "\n            ").concat((0, _StyleUtils.kebabifyBackgroundStyles)(currentBackgroundStyles), "\n          }\n          ").concat(pseudoBefore, " {\n            z-index: -100;\n            ").concat((!afterOpacity || finalImage) && createStyleImage(nextImage, originalData) || "", "\n            ").concat(afterOpacity && lastImage && createStyleImage(lastImage, originalData) || "", "\n            opacity: ").concat(Number(!afterOpacity), "; \n          }\n          ").concat(pseudoAfter, " {\n            z-index: -101;\n            ").concat((afterOpacity || finalImage) && createStyleImage(nextImage, originalData) || "", "\n            ").concat(!afterOpacity && lastImage && createStyleImage(lastImage, originalData) || "", "\n            ").concat(finalImage ? "opacity: ".concat(Number(afterOpacity), ";") : "", "\n          }\n        ");
};

/**
 * Creates a background-image string when certain conditions are met.
 *
 * @param image                   {string}  The current image.
 * @param originalData            {Object}  The original fluid or fixed image.
 * @return {string}
 */
exports.createPseudoStyles = createPseudoStyles;
var createStyleImage = function createStyleImage(image, originalData) {
  var hasStackedImages = (0, _ImageUtils.hasImageArray)({
    fluid: originalData
  }) && !(0, _MediaUtils.hasArtDirectionArray)({
    fluid: originalData
  });
  if ((0, _SimpleUtils.isBrowser)() || hasStackedImages) {
    return image ? "background-image: ".concat(image, ";") : "";
  }
  return "";
};

/**
 * Creates styles for the noscript element.
 *
 * @param className   string          One or more className(s)
 * @param image       string||array   Base data for one or multiple Images
 * @return {string}
 */
exports.createStyleImage = createStyleImage;
var createNoScriptStyles = function createNoScriptStyles(_ref2) {
  var className = _ref2.className,
    image = _ref2.image;
  if (image) {
    var returnArray = Array.isArray(image) && !(0, _MediaUtils.hasArtDirectionArray)({
      fluid: image
    });
    var addUrl = false;
    var allSources = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "src",
      checkLoaded: false,
      addUrl: addUrl,
      returnArray: returnArray
    });
    var sourcesAsUrl = (0, _ImageUtils.getUrlString)({
      imageString: allSources,
      hasImageUrls: true,
      returnArray: returnArray
    });
    var sourcesAsUrlWithCSS = "";
    if (returnArray) {
      var cssStrings = (0, _ImageUtils.getCurrentFromData)({
        data: image,
        propName: "CSS_STRING",
        addUrl: false,
        returnArray: returnArray
      });
      sourcesAsUrlWithCSS = (0, _SimpleUtils.filteredJoin)((0, _SimpleUtils.combineArray)(sourcesAsUrl, cssStrings));
    }
    var pseudoBefore = createPseudoElement(className);
    if ((0, _MediaUtils.hasArtDirectionArray)({
      fluid: image
    })) {
      return image.map(function (currentMedia) {
        var sourceString = (0, _ImageUtils.getUrlString)({
          imageString: currentMedia.src
        });
        var webPString = (0, _ImageUtils.getUrlString)({
          imageString: currentMedia.srcWebp || ""
        });
        if (currentMedia.media) {
          return createPseudoElementMediaQuery(pseudoBefore, currentMedia.media, sourceString, webPString);
        }
        return createPseudoElementMediaQuery(pseudoBefore, 'screen', sourceString, webPString);
      }).join('');
    }
    return createPseudoElementWithContent(pseudoBefore, sourcesAsUrlWithCSS || sourcesAsUrl);
  }
  return "";
};
exports.createNoScriptStyles = createNoScriptStyles;