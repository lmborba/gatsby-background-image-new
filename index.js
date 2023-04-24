"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _BackgroundUtils = _interopRequireDefault(require("./lib/BackgroundUtils"));
var _HelperUtils = require("./lib/HelperUtils");
var _ImageUtils = require("./lib/ImageUtils");
var _ImageCache = require("./lib/ImageCache");
var _ImageRef = require("./lib/ImageRef");
var _ImageHandling = require("./lib/ImageHandling");
var _StyleUtils = require("./lib/StyleUtils");
var _StyleCreation = require("./lib/StyleCreation");
var _IntersectionObserverUtils = require("./lib/IntersectionObserverUtils");
var _SimpleUtils = require("./lib/SimpleUtils");
var _excluded = ["className", "style", "fluid", "fixed", "backgroundColor", "durationFadeIn", "Tag", "children", "keepStatic"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Main Lazy-loading React background-image component
 * with optional support for the blur-up effect.
 */
var BackgroundImage = /*#__PURE__*/function (_React$Component) {
  _inherits(BackgroundImage, _React$Component);
  var _super = _createSuper(BackgroundImage);
  function BackgroundImage(props) {
    var _this;
    _classCallCheck(this, BackgroundImage);
    _this = _super.call(this, props);
    // IntersectionObserver listeners (if available).
    _defineProperty(_assertThisInitialized(_this), "cleanUpListeners", void 0);
    var convertedProps = (0, _HelperUtils.convertProps)(props);

    // Default settings for browser without Intersection Observer available.
    var isVisible = true;
    var imgLoaded = false;
    var IOSupported = false;
    var fadeIn = convertedProps.fadeIn;

    // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.
    var seenBefore = (0, _ImageCache.inImageCache)(convertedProps);

    // Browser with Intersection Observer available
    if (!seenBefore && (0, _SimpleUtils.isBrowser)() && window.IntersectionObserver) {
      isVisible = false;
      IOSupported = true;
    }

    // Never render image during SSR
    if (!(0, _SimpleUtils.isBrowser)()) {
      isVisible = false;
    }

    // Force render for critical images.
    if (convertedProps.critical) {
      isVisible = true;
      IOSupported = false;
    }

    // Check if a noscript element should be included, check on isBrowser() for #131.
    var hasNoScript = !(convertedProps.critical && !fadeIn) && !(0, _SimpleUtils.isBrowser)();

    // Set initial image state for transitioning.
    var imageState = 0;

    // Fixed class Name & added one (needed for multiple instances).
    var _fixClassName = (0, _StyleUtils.fixClassName)(convertedProps),
      _fixClassName2 = _slicedToArray(_fixClassName, 1),
      currentClassNames = _fixClassName2[0];

    // Preset backgroundStyles (e.g. during SSR or gatsby build).
    _this.backgroundStyles = (0, _StyleUtils.presetBackgroundStyles)((0, _BackgroundUtils["default"])(convertedProps.className));

    // Bind handlers to class.
    _this.handleImageLoaded = _this.handleImageLoaded.bind(_assertThisInitialized(_this));
    _this.handleRef = _this.handleRef.bind(_assertThisInitialized(_this));
    var convertedPropsNew = convertedProps;
    convertedPropsNew.isVisible = isVisible;

    // Create reference(s) to an Image loaded via picture element in background.
    _this.imageRef = (0, _ImageRef.createPictureRef)(convertedPropsNew, _this.handleImageLoaded);
    _this.selfRef = null;
    _this.state = {
      isVisible: isVisible,
      imgLoaded: imgLoaded,
      IOSupported: IOSupported,
      fadeIn: fadeIn,
      hasNoScript: hasNoScript,
      seenBefore: seenBefore,
      imageState: imageState,
      currentClassNames: currentClassNames
    };

    // console.log(`-------------------------------------------------------------`)
    return _this;
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
  _createClass(BackgroundImage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Update background(-*) styles from CSS (e.g. Styled Components).
      this.backgroundStyles = (0, _StyleUtils.presetBackgroundStyles)((0, _BackgroundUtils["default"])(this.props.className));
      if (this.state.isVisible && _typeof(this.props.onStartLoad) === "function") {
        this.props.onStartLoad({
          wasCached: (0, _ImageCache.inImageCache)(this.props)
        });
      }
      if (this.props.critical || this.state.seenBefore) {
        if ((0, _ImageRef.imageReferenceCompleted)(this.imageRef, this.props)) {
          this.handleImageLoaded();
        }
      }
      var _fixClassName3 = (0, _StyleUtils.fixClassName)(this.props),
        _fixClassName4 = _slicedToArray(_fixClassName3, 1),
        currentClassNames = _fixClassName4[0];
      this.setState({
        currentClassNames: currentClassNames
      });
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
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;
      // Check if we received a changed fluid / fixed image.
      if ((0, _ImageUtils.imagePropsChanged)(this.props, prevProps)) {
        var convertedProps = (0, _HelperUtils.convertProps)(this.props);
        var imageInCache = (0, _ImageCache.inImageCache)(convertedProps);
        var _fixClassName5 = (0, _StyleUtils.fixClassName)(convertedProps),
          _fixClassName6 = _slicedToArray(_fixClassName5, 1),
          currentClassNames = _fixClassName6[0];
        this.setState({
          isVisible: imageInCache || convertedProps.critical,
          imgLoaded: imageInCache,
          seenBefore: imageInCache,
          currentClassNames: currentClassNames
        }, function () {
          // Update bgImage & create new imageRef(s).
          _this2.bgImage = (0, _ImageUtils.getCurrentFromData)({
            data: _this2.imageRef,
            propName: "currentSrc",
            returnArray: true
          }) || (0, _ImageUtils.getCurrentFromData)({
            data: _this2.imageRef,
            propName: "src",
            returnArray: true
          });
          var convertedPropsNew = convertedProps;
          convertedPropsNew.isVisible = _this2.state.isVisible;
          _this2.imageRef = (0, _ImageRef.createPictureRef)(convertedPropsNew, _this2.handleImageLoaded);
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // Prevent calling handleImageLoaded from the imageRef(s) after unmount.
      if (this.imageRef) {
        if (Array.isArray(this.imageRef)) {
          this.imageRef.forEach(function (currentImageRef) {
            if (!!currentImageRef && !(0, _SimpleUtils.isString)(currentImageRef)) {
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
  }, {
    key: "intersectionListener",
    value: function intersectionListener() {
      var _this3 = this;
      var imageInCache = (0, _ImageCache.inImageCache)(this.props);
      if (!this.state.isVisible && _typeof(this.props.onStartLoad) === "function") {
        this.props.onStartLoad({
          wasCached: imageInCache
        });
      }

      // imgCached and imgLoaded must update after the image is activated and
      // isVisible is true. Once it is, imageRef becomes "accessible" for imgCached.
      // imgLoaded and imgCached are in a 2nd setState call to be changed together,
      // avoiding initiating unnecessary animation frames from style changes when
      // setting next imageState.
      this.imageRef = (0, _ImageRef.activatePictureRef)(this.imageRef, this.props, this.selfRef);
      this.setState(function (state) {
        return {
          isVisible: true,
          imageState: state.imageState + 1
        };
      }, function () {
        _this3.setState(function (state) {
          return {
            imgLoaded: imageInCache,
            imgCached: (0, _ImageRef.hasActivatedPictureRefs)(_this3.imageRef),
            imageState: state.imageState + 1
          };
        });
      });
    }
  }, {
    key: "handleRef",
    value: function handleRef(ref) {
      this.selfRef = ref;
      if (this.state.IOSupported && ref) {
        this.cleanUpListeners = (0, _IntersectionObserverUtils.listenToIntersections)(ref, this.intersectionListener, this.props.rootMargin);
      }
    }
  }, {
    key: "handleImageLoaded",
    value: function handleImageLoaded() {
      (0, _ImageCache.activateCacheForImage)(this.props);
      this.setState(function (state) {
        return {
          imgLoaded: true,
          imageState: state.imageState + 1
        };
      });
      if (this.state.seenBefore) {
        this.setState({
          fadeIn: false
        });
      }
      if (this.props.onLoad) {
        this.props.onLoad();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _fixOpacity = (0, _StyleUtils.fixOpacity)((0, _HelperUtils.convertProps)(this.props), this.props.preserveStackingContext),
        className = _fixOpacity.className,
        _fixOpacity$style = _fixOpacity.style,
        style = _fixOpacity$style === void 0 ? {} : _fixOpacity$style,
        fluid = _fixOpacity.fluid,
        fixed = _fixOpacity.fixed,
        backgroundColor = _fixOpacity.backgroundColor,
        durationFadeIn = _fixOpacity.durationFadeIn,
        Tag = _fixOpacity.Tag,
        children = _fixOpacity.children,
        keepStatic = _fixOpacity.keepStatic,
        props = _objectWithoutProperties(_fixOpacity, _excluded);
      var remainingProps = (0, _HelperUtils.stripRemainingProps)(props);
      var bgColor = _typeof(backgroundColor) === "boolean" ? "lightgray" : _typeof(backgroundColor) !== "undefined" ? backgroundColor : "";
      var shouldFadeIn = this.state.fadeIn === true && !this.state.imgCached || this.props.fadeIn === "soft";
      // With least one switch in the pseudo-elements, use half the durationFadeIn.
      var transitionDelay = shouldFadeIn ? "".concat(durationFadeIn / 2, "ms") : "none";

      // Create base container style and only add opacity hack when
      // preserveStackingContext is falsy.
      var divStyle = _objectSpread({
        position: "relative"
      }, style);
      if (!this.props.preserveStackingContext) divStyle.opacity = 0.99;

      // Choose image object of fluid or fixed, return null if not present.
      var image = (0, _ImageUtils.getCurrentSrcData)({
        fluid: fluid,
        fixed: fixed,
        returnArray: true
      });
      var noScriptImageData = (0, _ImageUtils.getCurrentSrcData)({
        fluid: fluid,
        fixed: fixed
      }) || {};
      if (fluid || fixed) {
        if (fixed) {
          divStyle.width = style.width || image.width;
          divStyle.height = style.height || image.height;
          divStyle.display = "inline-block";
          if (style.display === "inherit") {
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
      var newImageSettings = (0, _ImageHandling.switchImageSettings)({
        image: image,
        bgImage: this.bgImage,
        imageRef: this.imageRef,
        state: this.state
      });

      // Set bgImage to available newImageSettings or fallback.
      this.bgImage = newImageSettings.nextImageArray || newImageSettings.nextImage || this.bgImage;

      // Create styles for the next background image(s).
      var pseudoStyles = (0, _StyleCreation.createPseudoStyles)(_objectSpread(_objectSpread({
        className: this.state.currentClassNames,
        transitionDelay: transitionDelay,
        bgColor: bgColor,
        backgroundStyles: this.backgroundStyles,
        style: style,
        fadeIn: shouldFadeIn
      }, newImageSettings), {}, {
        originalData: fluid || fixed
      }));
      var noScriptPseudoStyles = (0, _StyleCreation.createNoScriptStyles)({
        image: image,
        bgColor: bgColor,
        className: this.state.currentClassNames,
        backgroundStyles: this.backgroundStyles,
        style: style
      });

      // console.table(newImageSettings)
      // console.log(pseudoStyles)
      // console.log(image, noScriptPseudoStyles)

      // Switch key between fluid & fixed.
      var componentKey = "".concat(fluid ? "fluid" : "").concat(fixed ? "fixed" : "", "-").concat(JSON.stringify(noScriptImageData.srcSet));

      // Combine currentStyles according to specificity.
      var currentStyles = _objectSpread(_objectSpread({}, this.backgroundStyles), divStyle);
      return /*#__PURE__*/_react["default"].createElement(Tag, _extends({
        className: this.state.currentClassNames,
        style: currentStyles,
        ref: this.handleRef,
        key: componentKey
      }, remainingProps), /*#__PURE__*/_react["default"].createElement("style", {
        dangerouslySetInnerHTML: {
          __html: pseudoStyles
        }
      }), this.state.hasNoScript && /*#__PURE__*/_react["default"].createElement("noscript", null, /*#__PURE__*/_react["default"].createElement("style", {
        dangerouslySetInnerHTML: {
          __html: noScriptPseudoStyles
        }
      })), children);
    }
  }]);
  return BackgroundImage;
}(_react["default"].Component);
BackgroundImage.defaultProps = {
  critical: false,
  fadeIn: true,
  durationFadeIn: 500,
  Tag: "div",
  preserveStackingContext: false,
  rootMargin: "200px",
  keepStatic: false
};
var fixedObject = _propTypes["default"].shape({
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired,
  src: _propTypes["default"].string.isRequired,
  srcSet: _propTypes["default"].string.isRequired,
  base64: _propTypes["default"].string,
  tracedSVG: _propTypes["default"].string,
  srcWebp: _propTypes["default"].string,
  srcSetWebp: _propTypes["default"].string,
  srcAvif: _propTypes["default"].string,
  srcSetAvif: _propTypes["default"].string,
  media: _propTypes["default"].string
});
var fluidObject = _propTypes["default"].shape({
  aspectRatio: _propTypes["default"].number.isRequired,
  src: _propTypes["default"].string.isRequired,
  srcSet: _propTypes["default"].string.isRequired,
  sizes: _propTypes["default"].string,
  base64: _propTypes["default"].string,
  tracedSVG: _propTypes["default"].string,
  srcWebp: _propTypes["default"].string,
  srcSetWebp: _propTypes["default"].string,
  srcAvif: _propTypes["default"].string,
  srcSetAvif: _propTypes["default"].string,
  media: _propTypes["default"].string
});
BackgroundImage.propTypes = {
  fixed: _propTypes["default"].oneOfType([fixedObject, _propTypes["default"].arrayOf(fixedObject), _propTypes["default"].arrayOf(_propTypes["default"].oneOfType([fixedObject, _propTypes["default"].string]))]),
  fluid: _propTypes["default"].oneOfType([fluidObject, _propTypes["default"].arrayOf(fluidObject), _propTypes["default"].arrayOf(_propTypes["default"].oneOfType([fluidObject, _propTypes["default"].string]))]),
  fadeIn: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  durationFadeIn: _propTypes["default"].number,
  className: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  // Support Glamor's css prop.
  critical: _propTypes["default"].bool,
  crossOrigin: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  style: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]),
  // Using PropTypes from RN.
  backgroundColor: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  onLoad: _propTypes["default"].func,
  onError: _propTypes["default"].func,
  onStartLoad: _propTypes["default"].func,
  Tag: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  preserveStackingContext: _propTypes["default"].bool,
  rootMargin: _propTypes["default"].string,
  keepStatic: _propTypes["default"].bool
};
var _default = BackgroundImage;
exports["default"] = _default;
