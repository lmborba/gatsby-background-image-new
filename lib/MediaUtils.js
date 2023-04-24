"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchesMedia = exports.hasArtDirectionSupport = exports.hasArtDirectionArray = exports.groupByMedia = exports.createSourceElementForSrcSet = exports.createArtDirectionSources = void 0;
var _sortMediaQueries = _interopRequireDefault(require("sort-media-queries"));
var _SimpleUtils = require("./SimpleUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/**
 * Return an array ordered by elements having a media prop, does not use
 * native sort, as a stable sort is not guaranteed by all browsers/versions
 *
 * @param imageVariants   array   The art-directed images.-
 */
var groupByMedia = function groupByMedia(imageVariants) {
  var without = [];
  var sortedVariants = (0, _sortMediaQueries["default"])(imageVariants, 'media');
  sortedVariants.forEach(function (variant) {
    return !variant.media && without.push(variant);
  });
  if (without.length > 1 && process.env.NODE_ENV !== "production") {
    console.warn("We've found ".concat(without.length, " sources without a media property. They might be ignored by the browser, see: https://www.gatsbyjs.org/packages/gatsby-image/#art-directing-multiple-images"));
  }
  return sortedVariants;
};

/**
 * Creates a single source element to add srcSets.
 *
 * @param {object}  image       The image to add sources from.
 * @param {string}  type  Which srcSet to add.
 */
exports.groupByMedia = groupByMedia;
var createSourceElementForSrcSet = function createSourceElementForSrcSet(image, type) {
  var source = document.createElement('source');
  var srcSetName = "srcSet".concat((0, _SimpleUtils.capitalize)(type));
  if (srcSetName in image) {
    source.type = "image/".concat(type);
    source.srcset = image[srcSetName];
  }
  if (image.sizes) {
    source.sizes = image.sizes;
  }
  if (image.media) {
    source.media = image.media;
  }
  return source.srcset ? source : null;
};

/**
 * Creates a source Array from media objects.
 *
 * @param fluid
 * @param fixed
 * @return {*}
 */
exports.createSourceElementForSrcSet = createSourceElementForSrcSet;
var createArtDirectionSources = function createArtDirectionSources(_ref) {
  var fluid = _ref.fluid,
    fixed = _ref.fixed;
  var currentSource = fluid || fixed;
  return currentSource.reduce(function (sources, image) {
    if (!image.media) {
      return sources;
    }
    var sourceWebp = createSourceElementForSrcSet(image, 'webp');
    var sourceAvif = createSourceElementForSrcSet(image, 'avif');
    sourceWebp && sources.push(sourceWebp);
    sourceAvif && sources.push(sourceAvif);
    return sources;
  }, []);
};

/**
 * Checks if fluid or fixed are art-direction arrays.
 *
 * @param props   object   The props to check for images.
 * @param prop    string   Check for fluid or fixed.
 * @return {boolean}
 */
exports.createArtDirectionSources = createArtDirectionSources;
var hasArtDirectionSupport = function hasArtDirectionSupport(props, prop) {
  return props[prop] && Array.isArray(props[prop]) && props[prop].some(function (image) {
    return !!image && typeof image.media !== 'undefined';
  });
};

/**
 * Checks for fluid or fixed Art direction support.
 * @param props
 * @return {boolean}
 */
exports.hasArtDirectionSupport = hasArtDirectionSupport;
var hasArtDirectionArray = function hasArtDirectionArray(props) {
  return hasArtDirectionSupport(props, 'fluid') || hasArtDirectionSupport(props, 'fixed');
};

/**
 * Tries to detect if a media query matches the current viewport.
 *
 * @param media   string  A media query string.
 * @return {boolean}
 */
exports.hasArtDirectionArray = hasArtDirectionArray;
var matchesMedia = function matchesMedia(_ref2) {
  var media = _ref2.media;
  return media ? (0, _SimpleUtils.isBrowser)() && _typeof(window.matchMedia) !== "undefined" && !!window.matchMedia(media).matches : false;
};
exports.matchesMedia = matchesMedia;