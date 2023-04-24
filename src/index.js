import React from "react";
import PropTypes from "prop-types";
import getBackgroundStyles from "./lib/BackgroundUtils";
import { convertProps, stripRemainingProps } from "./lib/HelperUtils";
import {
  getCurrentFromData,
  getCurrentSrcData,
  imagePropsChanged,
} from "./lib/ImageUtils";
import { activateCacheForImage, inImageCache } from "./lib/ImageCache";
import {
  activatePictureRef,
  createPictureRef,
  hasActivatedPictureRefs,
  imageReferenceCompleted,
} from "./lib/ImageRef";
import { switchImageSettings } from "./lib/ImageHandling";
import {
  fixClassName,
  fixOpacity,
  presetBackgroundStyles,
} from "./lib/StyleUtils";
import { createNoScriptStyles, createPseudoStyles } from "./lib/StyleCreation";
import { listenToIntersections } from "./lib/IntersectionObserverUtils";
import { isBrowser, isString } from "./lib/SimpleUtils";

/**
 * Main Lazy-loading React background-image component
 * with optional support for the blur-up effect.
 */
class BackgroundImage extends React.Component {
  // IntersectionObserver listeners (if available).
  cleanUpListeners;

  constructor(props) {
    super(props);

    const convertedProps = convertProps(props);

    // Default settings for browser without Intersection Observer available.
    let isVisible = true;
    const imgLoaded = false;
    let IOSupported = false;
    const { fadeIn } = convertedProps;

    // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.
    const seenBefore = inImageCache(convertedProps);

    // Browser with Intersection Observer available
    if (!seenBefore && isBrowser() && window.IntersectionObserver) {
      isVisible = false;
      IOSupported = true;
    }

    // Never render image during SSR
    if (!isBrowser()) {
      isVisible = false;
    }

    // Force render for critical images.
    if (convertedProps.critical) {
      isVisible = true;
      IOSupported = false;
    }

    // Check if a noscript element should be included, check on isBrowser() for #131.
    const hasNoScript = !(convertedProps.critical && !fadeIn) && !isBrowser();

    // Set initial image state for transitioning.
    const imageState = 0;

    // Fixed class Name & added one (needed for multiple instances).
    const [currentClassNames] = fixClassName(convertedProps);

    // Preset backgroundStyles (e.g. during SSR or gatsby build).
    this.backgroundStyles = presetBackgroundStyles(
      getBackgroundStyles(convertedProps.className)
    );

    // Bind handlers to class.
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.handleRef = this.handleRef.bind(this);

    // Create reference(s) to an Image loaded via picture element in background.
    this.imageRef = createPictureRef(
      { ...convertedProps, isVisible },
      this.handleImageLoaded
    );

    this.selfRef = null;

    this.state = {
      isVisible,
      imgLoaded,
      IOSupported,
      fadeIn,
      hasNoScript,
      seenBefore,
      imageState,
      currentClassNames,
    };

    // console.log(`-------------------------------------------------------------`)
  }

  // static getDerivedStateFromProps(props, state) {
  //   const { seenBefore, initialImageRef } = state;
  //   if (initialImageRef && seenBefore) {
  //     activateCacheForImage(props);
  //     return {
  //       imgLoaded: true,
  //       initialImageRef: false,
  //     };
  //   }
  //   return null;
  // }

  componentDidMount() {
    // Update background(-*) styles from CSS (e.g. Styled Components).
    this.backgroundStyles = presetBackgroundStyles(
      getBackgroundStyles(this.props.className)
    );

    if (this.state.isVisible && typeof this.props.onStartLoad === `function`) {
      this.props.onStartLoad({ wasCached: inImageCache(this.props) });
    }

    if (this.props.critical || this.state.seenBefore) {
      if (imageReferenceCompleted(this.imageRef, this.props)) {
        this.handleImageLoaded();
      }
    }

    const [currentClassNames] = fixClassName(this.props);
    this.setState({ currentClassNames });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.table(this.state, imagePropsChanged(this.props, nextProps))
  //   return (
  //     !this.state.initialImageRef &&
  //     !this.state.seenBefore &&
  //     !this.state.imageLoaded
  //     // !imagePropsChanged(this.props, nextProps)
  //   )
  // }

  componentDidUpdate(prevProps) {
    // Check if we received a changed fluid / fixed image.
    if (imagePropsChanged(this.props, prevProps)) {
      const convertedProps = convertProps(this.props);
      const imageInCache = inImageCache(convertedProps);
      const [currentClassNames] = fixClassName(convertedProps);

      this.setState(
        {
          isVisible: imageInCache || convertedProps.critical,
          imgLoaded: imageInCache,
          seenBefore: imageInCache,
          currentClassNames,
        },
        () => {
          // Update bgImage & create new imageRef(s).
          this.bgImage =
            getCurrentFromData({
              data: this.imageRef,
              propName: `currentSrc`,
              returnArray: true,
            }) ||
            getCurrentFromData({
              data: this.imageRef,
              propName: `src`,
              returnArray: true,
            });
          this.imageRef = createPictureRef(
            { ...convertedProps, isVisible: this.state.isVisible },
            this.handleImageLoaded
          );
        }
      );
    }
  }

  componentWillUnmount() {
    // Prevent calling handleImageLoaded from the imageRef(s) after unmount.
    if (this.imageRef) {
      if (Array.isArray(this.imageRef)) {
        this.imageRef.forEach((currentImageRef) => {
          if (!!currentImageRef && !isString(currentImageRef)) {
            currentImageRef.onload = null;
          }
        });
      } else {
        this.imageRef.onload = null;
      }
    }
    // Clean up all IntersectionObserver listeners.
    if (this.cleanUpListeners) {
      this.cleanUpListeners();
    }
  }

  intersectionListener = () => {
    const imageInCache = inImageCache(this.props);
    if (!this.state.isVisible && typeof this.props.onStartLoad === `function`) {
      this.props.onStartLoad({ wasCached: imageInCache });
    }

    // imgCached and imgLoaded must update after the image is activated and
    // isVisible is true. Once it is, imageRef becomes "accessible" for imgCached.
    // imgLoaded and imgCached are in a 2nd setState call to be changed together,
    // avoiding initiating unnecessary animation frames from style changes when
    // setting next imageState.
    this.imageRef = activatePictureRef(this.imageRef, this.props, this.selfRef);
    this.setState(
      (state) => ({
        isVisible: true,
        imageState: state.imageState + 1,
      }),
      () => {
        this.setState((state) => ({
          imgLoaded: imageInCache,
          imgCached: hasActivatedPictureRefs(this.imageRef),
          imageState: state.imageState + 1,
        }));
      }
    );
  };

  handleRef(ref) {
    this.selfRef = ref;
    if (this.state.IOSupported && ref) {
      this.cleanUpListeners = listenToIntersections(
        ref,
        this.intersectionListener,
        this.props.rootMargin
      );
    }
  }

  handleImageLoaded() {
    activateCacheForImage(this.props);

    this.setState((state) => ({
      imgLoaded: true,
      imageState: state.imageState + 1,
    }));
    if (this.state.seenBefore) {
      this.setState({ fadeIn: false });
    }

    if (this.props.onLoad) {
      this.props.onLoad();
    }
  }

  render() {
    const {
      className,
      style = {},
      fluid,
      fixed,
      backgroundColor,
      durationFadeIn,
      Tag,
      children,
      keepStatic,
      ...props
    } = fixOpacity(
      convertProps(this.props),
      this.props.preserveStackingContext
    );

    const remainingProps = stripRemainingProps(props);

    const bgColor =
      typeof backgroundColor === `boolean`
        ? `lightgray`
        : typeof backgroundColor !== `undefined`
        ? backgroundColor
        : ``;

    const shouldFadeIn =
      (this.state.fadeIn === true && !this.state.imgCached) ||
      this.props.fadeIn === `soft`;
    // With least one switch in the pseudo-elements, use half the durationFadeIn.
    const transitionDelay = shouldFadeIn ? `${durationFadeIn / 2}ms` : `none`;

    // Create base container style and only add opacity hack when
    // preserveStackingContext is falsy.
    const divStyle = {
      position: `relative`,
      ...style,
    };
    if (!this.props.preserveStackingContext) divStyle.opacity = 0.99;

    // Choose image object of fluid or fixed, return null if not present.
    const image = getCurrentSrcData({ fluid, fixed, returnArray: true });
    const noScriptImageData = getCurrentSrcData({ fluid, fixed }) || {};
    if (fluid || fixed) {
      if (fixed) {
        divStyle.width = style.width || image.width;
        divStyle.height = style.height || image.height;
        divStyle.display = `inline-block`;

        if (style.display === `inherit`) {
          delete divStyle.display;
        }
      }
    } else if (keepStatic) {
      // Prevent container from collapsing.
      noScriptImageData.srcSet = "";
    } else {
      return null;
    }

    // Set background-images and visibility according to images available.
    const newImageSettings = switchImageSettings({
      image,
      bgImage: this.bgImage,
      imageRef: this.imageRef,
      state: this.state,
    });

    // Set bgImage to available newImageSettings or fallback.
    this.bgImage =
      newImageSettings.nextImageArray ||
      newImageSettings.nextImage ||
      this.bgImage;

    // Create styles for the next background image(s).
    const pseudoStyles = createPseudoStyles({
      className: this.state.currentClassNames,
      transitionDelay,
      bgColor,
      backgroundStyles: this.backgroundStyles,
      style,
      fadeIn: shouldFadeIn,
      ...newImageSettings,
      originalData: fluid || fixed,
      f,
    });

    const noScriptPseudoStyles = createNoScriptStyles({
      image,
      bgColor,
      className: this.state.currentClassNames,
      backgroundStyles: this.backgroundStyles,
      style,
    });

    // Switch key between fluid & fixed.
    const componentKey = `${fluid ? `fluid` : ``}${
      fixed ? `fixed` : ``
    }-${JSON.stringify(noScriptImageData.srcSet)}`;

    // Combine currentStyles according to specificity.
    const currentStyles = {
      ...this.backgroundStyles,
      ...divStyle,
    };

    return (
      <Tag
        className={this.state.currentClassNames}
        style={currentStyles}
        ref={this.handleRef}
        key={componentKey}
        {...remainingProps}
      >
        {children}
      </Tag>
    );
  }
}

BackgroundImage.defaultProps = {
  critical: false,
  fadeIn: true,
  durationFadeIn: 500,
  Tag: `div`,
  preserveStackingContext: false,
  rootMargin: `200px`,
  keepStatic: false,
};

const fixedObject = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  base64: PropTypes.string,
  tracedSVG: PropTypes.string,
  srcWebp: PropTypes.string,
  srcSetWebp: PropTypes.string,
  srcAvif: PropTypes.string,
  srcSetAvif: PropTypes.string,
  media: PropTypes.string,
});

const fluidObject = PropTypes.shape({
  aspectRatio: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  sizes: PropTypes.string,
  base64: PropTypes.string,
  tracedSVG: PropTypes.string,
  srcWebp: PropTypes.string,
  srcSetWebp: PropTypes.string,
  srcAvif: PropTypes.string,
  srcSetAvif: PropTypes.string,
  media: PropTypes.string,
});

BackgroundImage.propTypes = {
  fixed: PropTypes.oneOfType([
    fixedObject,
    PropTypes.arrayOf(fixedObject),
    PropTypes.arrayOf(PropTypes.oneOfType([fixedObject, PropTypes.string])),
  ]),
  fluid: PropTypes.oneOfType([
    fluidObject,
    PropTypes.arrayOf(fluidObject),
    PropTypes.arrayOf(PropTypes.oneOfType([fluidObject, PropTypes.string])),
  ]),
  fadeIn: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  durationFadeIn: PropTypes.number,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Support Glamor's css prop.
  critical: PropTypes.bool,
  crossOrigin: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // Using PropTypes from RN.
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onStartLoad: PropTypes.func,
  Tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  preserveStackingContext: PropTypes.bool,
  rootMargin: PropTypes.string,
  keepStatic: PropTypes.bool,
};

export default BackgroundImage;
