"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchImageSettings = void 0;
var _ImageUtils = require("./ImageUtils");
var _MediaUtils = require("./MediaUtils");
var _SimpleUtils = require("./SimpleUtils");
/**
 * Compares the old states to the new and changes image settings accordingly.
 *
 * @param image     string||array   Base data for one or multiple Images.
 * @param bgImage   string||array   Last background image(s).
 * @param imageRef  string||array   References to one or multiple Images.
 * @param state     object          Component state.
 * @return {{afterOpacity: number, bgColor: *, bgImage: *, nextImage: string}}
 */
// eslint-disable-next-line import/prefer-default-export
var switchImageSettings = function switchImageSettings(_ref) {
  var image = _ref.image,
    bgImage = _ref.bgImage,
    imageRef = _ref.imageRef,
    state = _ref.state;
  // Read currentSrc from imageRef (if exists).
  var currentSources = (0, _ImageUtils.getCurrentFromData)({
    data: imageRef,
    propName: "currentSrc"
  });
  // Check if image is Array.
  var returnArray = Array.isArray(image) && !(0, _MediaUtils.hasArtDirectionArray)({
    fluid: image
  });
  // Backup bgImage to lastImage.
  var lastImage = Array.isArray(bgImage) ? (0, _SimpleUtils.filteredJoin)(bgImage) : bgImage;
  // Set the backgroundImage according to images available.
  var nextImage;
  var nextImageArray;
  // Signal to `createPseudoStyles()` when we have reached the final image,
  // which is important for transparent background-image(s).
  var finalImage = returnArray && state.seenBefore && !!currentSources;
  if (returnArray) {
    if (!currentSources) {
      // Check for tracedSVG first.
      nextImage = (0, _ImageUtils.getCurrentFromData)({
        data: image,
        propName: "tracedSVG",
        returnArray: returnArray
      });
      // Now combine with base64 images.
      nextImage = (0, _SimpleUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
        data: image,
        propName: "base64",
        returnArray: returnArray
      }), nextImage);
    }
    // Now add possible `rgba()` or similar CSS string props.
    nextImage = (0, _SimpleUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "CSS_STRING",
      addUrl: false,
      returnArray: returnArray
    }), nextImage);
    // Do we have at least one img loaded?
    if ((state.imgLoaded || !!currentSources) && state.isVisible) {
      if (currentSources) {
        nextImage = (0, _SimpleUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
          data: imageRef,
          propName: "currentSrc",
          returnArray: returnArray
        }), nextImage);
        finalImage = true;
      } else {
        // No support for HTMLPictureElement or WebP present, get src.
        nextImage = (0, _SimpleUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
          data: imageRef,
          propName: "src",
          returnArray: returnArray
        }), nextImage);
        finalImage = true;
      }
    }
    // First fill last images from bgImage...
    nextImage = (0, _SimpleUtils.combineArray)(nextImage, bgImage);
    // ... then fill the rest of the background-images with a transparent dummy
    // pixel, lest the background-* properties can't target the correct image.
    var dummyArray = (0, _ImageUtils.createDummyImageArray)(image.length);
    // Now combine the two arrays and join them.
    nextImage = (0, _SimpleUtils.combineArray)(nextImage, dummyArray);
    nextImageArray = nextImage;
    nextImage = (0, _SimpleUtils.filteredJoin)(nextImage);
  } else {
    nextImage = "";
    nextImage = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "tracedSVG"
    }) || (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "base64"
    });
    if (state.imgLoaded && state.isVisible) {
      nextImage = currentSources;
      finalImage = true;
    }
  }

  // Change opacity according to imageState.
  var afterOpacity = state.imageState % 2;
  if (!returnArray && nextImage === "" && state.imgLoaded && state.isVisible && imageRef && !imageRef.currentSrc) {
    // Should we still have no nextImage it might be because currentSrc is missing.
    nextImage = (0, _ImageUtils.getCurrentFromData)({
      data: imageRef,
      propName: "src",
      checkLoaded: false
    });
    finalImage = true;
  }
  // Fall back on lastImage (important for prop changes) if all else fails.
  if (!nextImage) nextImage = lastImage;
  var newImageSettings = {
    lastImage: lastImage,
    nextImage: nextImage,
    afterOpacity: afterOpacity,
    finalImage: finalImage
  };
  // Add nextImageArray for bgImage to newImageSettings if exists.
  if (nextImageArray) newImageSettings.nextImageArray = nextImageArray;
  return newImageSettings;
};
exports.switchImageSettings = switchImageSettings;