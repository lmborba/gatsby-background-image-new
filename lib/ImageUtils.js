"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBase64 = exports.imagePropsChanged = exports.imageLoaded = exports.imageArrayPropsChanged = exports.hasPictureElement = exports.hasImageUrl = exports.hasImageArray = exports.getUrlString = exports.getSelectedImage = exports.getImageSrcKey = exports.getCurrentSrcData = exports.getCurrentFromData = exports.createDummyImageArray = void 0;
var _MediaUtils = require("./MediaUtils");
var _SimpleUtils = require("./SimpleUtils");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/**
 * Returns the availability of the HTMLPictureElement unless in SSR mode.
 *
 * @return {boolean}
 */
var hasPictureElement = function hasPictureElement() {
  return (typeof HTMLPictureElement === "undefined" ? "undefined" : _typeof(HTMLPictureElement)) !== "undefined" || (0, _SimpleUtils.isBrowser)();
};

/**
 * Checks if fluid or fixed are image arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */
exports.hasPictureElement = hasPictureElement;
var hasImageArray = function hasImageArray(props) {
  return Boolean(props.fluid && Array.isArray(props.fluid) || props.fixed && Array.isArray(props.fixed));
};

/**
 * Extracts a value from an imageRef, image object or an array of them.
 *
 * @param data        HTMLImageElement||object||Array   Data to extract from.
 * @param propName    string    Property to extract.
 * @param addUrl      boolean   Should returned strings be encased in `url()`?
 * @param returnArray boolean   Switches between returning an array and a string.
 * @param checkLoaded boolean   Turns checking for imageLoaded() on and off.
 * @return {string||array}
 */
exports.hasImageArray = hasImageArray;
var getCurrentFromData = function getCurrentFromData(_ref) {
  var data = _ref.data,
    propName = _ref.propName,
    _ref$addUrl = _ref.addUrl,
    addUrl = _ref$addUrl === void 0 ? true : _ref$addUrl,
    _ref$returnArray = _ref.returnArray,
    returnArray = _ref$returnArray === void 0 ? false : _ref$returnArray,
    _ref$checkLoaded = _ref.checkLoaded,
    checkLoaded = _ref$checkLoaded === void 0 ? true : _ref$checkLoaded;
  if (!data || !propName) return "";
  // Handle tracedSVG with "special care".
  var tracedSVG = propName === "tracedSVG";
  if (Array.isArray(data) && !(0, _MediaUtils.hasArtDirectionArray)({
    fluid: data
  })) {
    // Filter out all elements not having the propName and return remaining.
    var imageString = data
    // .filter(dataElement => {
    //   return propName in dataElement && dataElement[propName]
    // })
    .map(function (dataElement) {
      // If `currentSrc` or `src` is needed, check image load completion first.
      if (propName === "currentSrc" || propName === 'src') {
        return checkLoaded ? imageLoaded(dataElement) && dataElement[propName] || "" : dataElement[propName];
      }
      // Check if CSS strings should be parsed.
      if (propName === "CSS_STRING" && (0, _SimpleUtils.isString)(dataElement)) {
        return dataElement;
      }
      return (0, _SimpleUtils.isString)(dataElement) ? dataElement : dataElement && propName in dataElement ? dataElement[propName] : "";
    });
    // Encapsulate in URL string and return.
    return getUrlString({
      imageString: imageString,
      tracedSVG: tracedSVG,
      addUrl: addUrl,
      returnArray: returnArray
    });
  }
  if ((0, _MediaUtils.hasArtDirectionArray)({
    fluid: data
  }) && (propName === "currentSrc" || propName === "src" || propName === "base64" || tracedSVG)) {
    var currentData = getCurrentSrcData({
      fluid: data
    });
    return propName in currentData ? getUrlString({
      imageString: currentData[propName],
      tracedSVG: tracedSVG,
      addUrl: addUrl
    }) : "";
  }
  if (_typeof(data) !== 'object') {
    return '';
  }

  // If `currentSrc` or `src` is needed, check image load completion first.
  if ((propName === "currentSrc" || propName === 'src') && propName in data) {
    return getUrlString({
      imageString: checkLoaded ? imageLoaded(data) && data[propName] || "" : data[propName],
      addUrl: addUrl
    });
  }
  return propName in data ? getUrlString({
    imageString: data[propName],
    tracedSVG: tracedSVG,
    addUrl: addUrl
  }) : "";
};

/**
 * Find the source of an image to use as a key in the image cache.
 * Use `the first matching image in either `fixed` or `fluid`
 *
 * @param {{fluid: {src: string}[], fixed: {src: string}[]}} args
 * @return {string|null}
 */
exports.getCurrentFromData = getCurrentFromData;
var getImageSrcKey = function getImageSrcKey(_ref2) {
  var fluid = _ref2.fluid,
    fixed = _ref2.fixed;
  var data = getCurrentSrcData({
    fluid: fluid,
    fixed: fixed
  });
  return data ? data.src || null : null;
};

/**
 * Returns the current src if possible with art-direction support.
 *
 * @param fluid         object    Fluid Image (Array) if existent.
 * @param fixed         object    Fixed Image (Array) if existent.
 * @param returnArray   boolean   Return original image stack.
 * @param index         boolean   The image to return for image stacks.
 * @return {*}
 */
exports.getImageSrcKey = getImageSrcKey;
var getCurrentSrcData = function getCurrentSrcData(_ref3) {
  var fluid = _ref3.fluid,
    fixed = _ref3.fixed,
    returnArray = _ref3.returnArray;
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var currentData = fluid || fixed;
  if (hasImageArray({
    fluid: fluid,
    fixed: fixed
  })) {
    if (returnArray) {
      return currentData;
    }
    if ((0, _SimpleUtils.isBrowser)() && (0, _MediaUtils.hasArtDirectionArray)({
      fluid: fluid,
      fixed: fixed
    })) {
      // Do we have an image for the current Viewport?
      var mediaData = currentData.slice().reverse();
      var foundMedia = mediaData.findIndex(_MediaUtils.matchesMedia);
      if (foundMedia !== -1) {
        return mediaData[foundMedia];
      }
    }
    // Else return the selected image.
    return currentData[index];
  }
  return currentData;
};

/**
 * Return the first image of an imageStack
 *
 * @param fluid   object    Fluid Image (Array) if existent.
 * @param fixed   object    Fixed Image (Array) if existent.
 * @param index
 * @return {*}
 */
exports.getCurrentSrcData = getCurrentSrcData;
var getSelectedImage = function getSelectedImage(_ref4) {
  var fluid = _ref4.fluid,
    fixed = _ref4.fixed;
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var currentData = fluid || fixed;
  if (hasImageArray({
    fluid: fluid,
    fixed: fixed
  })) {
    // Fall back on first image if `index` has no entry.
    return currentData[index] || currentData[0];
  }
  return currentData;
};

/**
 * Encapsulates an imageString with a url if needed.
 *
 * @param imageString   string    String to encapsulate.
 * @param tracedSVG     boolean   Special care for SVGs.
 * @param addUrl        boolean   If the string should be encapsulated or not.
 * @param returnArray   boolean   Return concatenated string or Array.
 * @param hasImageUrls  boolean   Force return of quoted string(s) for url().
 * @return {string||array}
 */
exports.getSelectedImage = getSelectedImage;
var getUrlString = function getUrlString(_ref5) {
  var imageString = _ref5.imageString,
    _ref5$tracedSVG = _ref5.tracedSVG,
    tracedSVG = _ref5$tracedSVG === void 0 ? false : _ref5$tracedSVG,
    _ref5$addUrl = _ref5.addUrl,
    addUrl = _ref5$addUrl === void 0 ? true : _ref5$addUrl,
    _ref5$returnArray = _ref5.returnArray,
    returnArray = _ref5$returnArray === void 0 ? false : _ref5$returnArray,
    _ref5$hasImageUrls = _ref5.hasImageUrls,
    hasImageUrls = _ref5$hasImageUrls === void 0 ? false : _ref5$hasImageUrls;
  if (Array.isArray(imageString)) {
    var stringArray = imageString.map(function (currentString) {
      if (currentString) {
        var _base = isBase64(currentString);
        var _imageUrl = hasImageUrls || hasImageUrl(currentString);
        var currentReturnString = currentString && tracedSVG ? "\"".concat(currentString, "\"") : currentString && !_base && !tracedSVG && _imageUrl ? "'".concat(currentString, "'") : currentString;
        return addUrl && currentString ? "url(".concat(currentReturnString, ")") : currentReturnString;
      }
      return currentString;
    });
    return returnArray ? stringArray : (0, _SimpleUtils.filteredJoin)(stringArray);
  }
  var base64 = isBase64(imageString);
  var imageUrl = hasImageUrls || hasImageUrl(imageString);
  var returnString = imageString && tracedSVG ? "\"".concat(imageString, "\"") : imageString && !base64 && !tracedSVG && imageUrl ? "'".concat(imageString, "'") : imageString;
  return imageString ? addUrl ? "url(".concat(returnString, ")") : returnString : "";
};

/**
 * Checks a (possible) string on having `base64` in it.
 *
 * @param base64String        {string|*}    The string to check.
 * @return {boolean|boolean}
 */
exports.getUrlString = getUrlString;
var isBase64 = function isBase64(base64String) {
  return (0, _SimpleUtils.isString)(base64String) && base64String.indexOf("base64") !== -1;
};

/**
 * Checks a (possible) string on having `http` in it.
 *
 * @param imageString         {string|*}    The string to check.
 * @return {boolean|boolean}
 */
exports.isBase64 = isBase64;
var hasImageUrl = function hasImageUrl(imageString) {
  return (0, _SimpleUtils.isString)(imageString) && imageString.substr(0, 4) === "http";
};

/**
 * Checks if any image props have changed.
 *
 * @param props
 * @param prevProps
 * @return {*}
 */
exports.hasImageUrl = hasImageUrl;
var imagePropsChanged = function imagePropsChanged(props, prevProps) {
  return (
    // Do we have different image types?
    props.fluid && !prevProps.fluid || props.fixed && !prevProps.fixed || imageArrayPropsChanged(props, prevProps) ||
    // Are single image sources different?
    props.fluid && prevProps.fluid && props.fluid.src !== prevProps.fluid.src || props.fixed && prevProps.fixed && props.fixed.src !== prevProps.fixed.src
  );
};

/**
 * Decides if two given props with array images differ.
 *
 * @param props
 * @param prevProps
 * @return {boolean}
 */
exports.imagePropsChanged = imagePropsChanged;
var imageArrayPropsChanged = function imageArrayPropsChanged(props, prevProps) {
  var isPropsFluidArray = Array.isArray(props.fluid);
  var isPrevPropsFluidArray = Array.isArray(prevProps.fluid);
  var isPropsFixedArray = Array.isArray(props.fixed);
  var isPrevPropsFixedArray = Array.isArray(prevProps.fixed);
  if (
  // Did the props change to a single image?
  isPropsFluidArray && !isPrevPropsFluidArray || isPropsFixedArray && !isPrevPropsFixedArray ||
  // Did the props change to an Array?
  !isPropsFluidArray && isPrevPropsFluidArray || !isPropsFixedArray && isPrevPropsFixedArray) {
    return true;
  }
  // Are the lengths or sources in the Arrays different?
  if (isPropsFluidArray && isPrevPropsFluidArray) {
    if (props.fluid.length === prevProps.fluid.length) {
      // Check for individual image or CSS string changes.
      return props.fluid.some(function (image, index) {
        return image.src !== prevProps.fluid[index].src;
      });
    }
    return true;
  }
  if (isPropsFixedArray && isPrevPropsFixedArray) {
    if (props.fixed.length === prevProps.fixed.length) {
      // Check for individual image or CSS string changes.
      return props.fixed.some(function (image, index) {
        return image.src !== prevProps.fixed[index].src;
      });
    }
    return true;
  }
};

/**
 * Creates an array with a transparent dummy pixel for background-* properties.
 *
 * @param length
 * @return {any[]}
 */
exports.imageArrayPropsChanged = imageArrayPropsChanged;
var createDummyImageArray = function createDummyImageArray(length) {
  var DUMMY_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  var dummyImageURI = getUrlString({
    imageString: DUMMY_IMG
  });
  return Array(length).fill(dummyImageURI);
};

/**
 * Checks if an image really was fully loaded.
 *
 * @param imageRef  HTMLImageElement  Reference to an image.
 * @return {boolean}
 */
exports.createDummyImageArray = createDummyImageArray;
var imageLoaded = function imageLoaded(imageRef) {
  return imageRef ? (0, _SimpleUtils.isString)(imageRef) || imageRef.complete && imageRef.naturalWidth !== 0 && imageRef.naturalHeight !== 0 : false;
};
exports.imageLoaded = imageLoaded;