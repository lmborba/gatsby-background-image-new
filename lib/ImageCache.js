"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetImageCache = exports.inImageCache = exports.allInImageCache = exports.activateCacheForMultipleImages = exports.activateCacheForImage = void 0;
var _HelperUtils = require("./HelperUtils");
var _MediaUtils = require("./MediaUtils");
var _ImageUtils = require("./ImageUtils");
var _SimpleUtils = require("./SimpleUtils");
var imageCache = Object.create({});
/**
 * Cache if we've seen an image before so we don't bother with
 * lazy-loading & fading in on subsequent mounts.
 *
 * @param props
 * @param index
 * @param isLoop
 * @return {boolean}
 */
var inImageCache = function inImageCache(props) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var isLoop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  var isImageStack = (0, _ImageUtils.hasImageArray)(convertedProps) && !(0, _MediaUtils.hasArtDirectionArray)(convertedProps);
  if (isImageStack && !isLoop) {
    return allInImageCache(props);
  }

  // Find src
  var src = isImageStack ? (0, _ImageUtils.getSelectedImage)(convertedProps, index) : (0, _ImageUtils.getImageSrcKey)(convertedProps);
  if ((0, _SimpleUtils.isObject)(src)) {
    var objectSrc = (0, _ImageUtils.getImageSrcKey)({
      fluid: src,
      fixed: src
    });
    return imageCache[objectSrc] || false;
  }
  return imageCache[src] || false;
};

/**
 * Processes an image stack with inImageCache.
 *
 * @param props  object    Component Props (with fluid or fixed as array).
 * @return {*|boolean}
 */
exports.inImageCache = inImageCache;
var allInImageCache = function allInImageCache(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  // Extract Image Array.
  var imageStack = convertedProps.fluid || convertedProps.fixed;
  // Only return true if every image is in cache.
  return imageStack.every(function (imageData, index) {
    return inImageCache(convertedProps, index, true);
  });
};

/**
 * Adds an Image to imageCache.
 *
 * @param props
 * @param index
 * @param isLoop
 */
exports.allInImageCache = allInImageCache;
var activateCacheForImage = function activateCacheForImage(props) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var isLoop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  var isImageStack = (0, _ImageUtils.hasImageArray)(convertedProps) && !(0, _MediaUtils.hasArtDirectionArray)(convertedProps);
  if (isImageStack && !isLoop) {
    return activateCacheForMultipleImages(props);
  }
  // Find src
  var src = isImageStack ? (0, _ImageUtils.getSelectedImage)(convertedProps, index) : (0, _ImageUtils.getImageSrcKey)(convertedProps);
  if (src) {
    if ((0, _SimpleUtils.isObject)(src)) {
      var objectSrc = (0, _ImageUtils.getImageSrcKey)({
        fluid: src,
        fixed: src
      });
      imageCache[objectSrc] = true;
    } else {
      imageCache[src] = true;
    }
  }
};

/**
 * Activates the Cache for multiple Images.
 *
 * @param props
 */
exports.activateCacheForImage = activateCacheForImage;
var activateCacheForMultipleImages = function activateCacheForMultipleImages(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  // Extract Image Array.
  var imageStack = convertedProps.fluid || convertedProps.fixed;
  imageStack.forEach(function (imageData, index) {
    return activateCacheForImage(convertedProps, index, true);
  });
};

/**
 * Resets the image cache (especially important for reliable tests).
 */
exports.activateCacheForMultipleImages = activateCacheForMultipleImages;
var resetImageCache = function resetImageCache() {
  for (var prop in imageCache) delete imageCache[prop];
};
exports.resetImageCache = resetImageCache;