"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageReferenceCompleted = exports.hasPictureRef = exports.hasActivatedPictureRefs = exports.createPictureRef = exports.createMultiplePictureRefs = exports.activatePictureRef = exports.activateMultiplePictureRefs = void 0;
var _HelperUtils = require("./HelperUtils");
var _ImageUtils = require("./ImageUtils");
var _MediaUtils = require("./MediaUtils");
var _SimpleUtils = require("./SimpleUtils");
var _ImageCache = require("./ImageCache");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/**
 * Creates an image reference to be activated on critical or visibility.
 * @param props
 * @param onLoad
 * @param index
 * @param isLoop
 * @return {HTMLImageElement|null|Array}
 */
var createPictureRef = function createPictureRef(props, onLoad, index) {
  var isLoop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  if ((0, _SimpleUtils.isBrowser)() && (_typeof(convertedProps.fluid) !== "undefined" || _typeof(convertedProps.fixed) !== "undefined")) {
    var isImageStack = (0, _ImageUtils.hasImageArray)(convertedProps) && !(0, _MediaUtils.hasArtDirectionArray)(convertedProps);
    if (isImageStack && !isLoop) {
      return createMultiplePictureRefs(props, onLoad);
    }
    var img = new Image();
    img.onload = function () {
      return onLoad();
    };
    if (!img.complete && _typeof(convertedProps.onLoad) === "function") {
      img.addEventListener('load', convertedProps.onLoad);
    }
    if (_typeof(convertedProps.onError) === "function") {
      img.addEventListener('error', convertedProps.onError);
    }
    if (convertedProps.crossOrigin) {
      img.crossOrigin = convertedProps.crossOrigin;
    }

    // Only directly activate the image if critical (preload).
    if ((convertedProps.critical || convertedProps.isVisible) && !isLoop) {
      return activatePictureRef(img, convertedProps, index, isLoop);
    }
    return img;
  }
  return null;
};

/**
 * Creates multiple image references. Internal function.
 *
 * @param props   object    Component Props (with fluid or fixed as array).
 * @param onLoad  function  Callback for load handling.
 */
exports.createPictureRef = createPictureRef;
var createMultiplePictureRefs = function createMultiplePictureRefs(props, onLoad) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  // Extract Image Array.
  var imageStack = convertedProps.fluid || convertedProps.fixed;
  var imageRefs = imageStack.map(function (imageData, index) {
    return createPictureRef(convertedProps, onLoad, index, true);
  });
  // Only directly activate the image if critical (preload).
  if (convertedProps.critical || convertedProps.isVisible) {
    return activatePictureRef(imageRefs, convertedProps);
  }
  return imageRefs;
};

/**
 * Creates a picture element for the browser to decide which image to load.
 *
 * @param imageRef
 * @param props
 * @param selfRef
 * @param index
 * @param isLoop
 * @return {null|Array|*}
 */
exports.createMultiplePictureRefs = createMultiplePictureRefs;
var activatePictureRef = function activatePictureRef(imageRef, props) {
  var selfRef = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var isLoop = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  if ((0, _SimpleUtils.isBrowser)() && (_typeof(convertedProps.fluid) !== "undefined" || _typeof(convertedProps.fixed) !== "undefined")) {
    var isImageStack = (0, _ImageUtils.hasImageArray)(convertedProps) && !(0, _MediaUtils.hasArtDirectionArray)(convertedProps);
    if (isImageStack && !isLoop) {
      return activateMultiplePictureRefs(imageRef, props, selfRef);
    }
    // Clone body to get the correct sizes.
    // const bodyClone = document.body.cloneNode(true)
    var bodyClone = document.createElement('body');
    // Do we have an image stack or Art-direction array?
    // Then get its current or first(smallest) image respectively.
    var imageData = isImageStack ? (0, _ImageUtils.getSelectedImage)(convertedProps, index) : (0, _ImageUtils.getCurrentSrcData)(convertedProps);
    if (!imageData) {
      return null;
    }
    if ((0, _SimpleUtils.isString)(imageData)) {
      return imageData;
    }
    if (selfRef) {
      // Set original component's style.
      imageRef.width = selfRef.offsetWidth;
      imageRef.height = selfRef.offsetHeight;
    }

    // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
    // but don't prevent it during SSR.
    if ((0, _ImageUtils.hasPictureElement)()) {
      var pic = document.createElement('picture');
      if (selfRef) {
        // Set original component's style.
        pic.width = imageRef.width;
        pic.height = imageRef.height;
      }
      if ((0, _MediaUtils.hasArtDirectionArray)(convertedProps)) {
        var sources = (0, _MediaUtils.createArtDirectionSources)(convertedProps).reverse();
        sources.forEach(function (currentSource) {
          return pic.appendChild(currentSource);
        });
      }
      var sourcesAvif = (0, _MediaUtils.createSourceElementForSrcSet)(imageData, 'avif');
      sourcesAvif && pic.appendChild(sourcesAvif);
      var sourcesWebp = (0, _MediaUtils.createSourceElementForSrcSet)(imageData, 'webp');
      sourcesWebp && pic.appendChild(sourcesWebp);
      pic.appendChild(imageRef);
      bodyClone.appendChild(pic);
    }
    imageRef.sizes = imageData.sizes || "";
    imageRef.srcset = imageData.srcSet || "";
    imageRef.src = imageData.src || "";
    return imageRef;
  }
  return null;
};

/**
 * Creates multiple picture elements.
 *
 * @param imageRefs
 * @param props
 * @param selfRef
 * @return {Array||null}
 */
exports.activatePictureRef = activatePictureRef;
var activateMultiplePictureRefs = function activateMultiplePictureRefs(imageRefs, props, selfRef) {
  // Extract Image Array.
  return imageRefs.map(function (imageRef, index) {
    return activatePictureRef(imageRef, props, selfRef, index, true);
  });
};

/**
 * Checks imageRefs on being active.
 *
 * @param imageRefs
 * @return {*}
 */
exports.activateMultiplePictureRefs = activateMultiplePictureRefs;
var hasActivatedPictureRefs = function hasActivatedPictureRefs(imageRefs) {
  return Array.isArray(imageRefs) ? imageRefs.every(function (imageRef) {
    return hasPictureRef(imageRef);
  }) : hasPictureRef(imageRefs);
};

/**
 * Checks imageRef for on being a string or has a currentSrc.
 *
 * @param imageRef
 * @return {boolean}
 */
exports.hasActivatedPictureRefs = hasActivatedPictureRefs;
var hasPictureRef = function hasPictureRef(imageRef) {
  return (0, _SimpleUtils.isString)(imageRef) || !!imageRef && !!imageRef.currentSrc;
};

/**
 * Checks if an image (array) reference is existing and tests for complete.
 *
 * @param imageRef    HTMLImageElement||array   Image reference(s).
 * @param props
 * @return {boolean}
 */
exports.hasPictureRef = hasPictureRef;
var imageReferenceCompleted = function imageReferenceCompleted(imageRef, props) {
  return imageRef ? Array.isArray(imageRef) ? imageRef.every(function (singleImageRef) {
    return (0, _ImageUtils.imageLoaded)(singleImageRef);
  }) || (0, _ImageCache.inImageCache)(props) : (0, _ImageUtils.imageLoaded)(imageRef) || (0, _ImageCache.inImageCache)(props) : (0, _SimpleUtils.isString)(imageRef);
};
exports.imageReferenceCompleted = imageReferenceCompleted;