"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var reasons = _interopRequireWildcard(require("../internal/reasons"));

var _events = require("../internal/events");

var _Link = require("../internal/Link");

var _isString = _interopRequireDefault(require("is-string"));

var _linkTypes = require("link-types");

var _matchURL = _interopRequireDefault(require("../internal/matchURL"));

var _parseHTML = _interopRequireDefault(require("../internal/parseHTML"));

var _parseOptions = _interopRequireDefault(require("../internal/parseOptions"));

var _robotDirectives = _interopRequireWildcard(require("robot-directives"));

var _SafeEventEmitter = _interopRequireDefault(require("../internal/SafeEventEmitter"));

var _scrapeHTML = _interopRequireDefault(require("../internal/scrapeHTML"));

var _transitiveAuth = _interopRequireDefault(require("../internal/transitiveAuth"));

var _UrlChecker = _interopRequireDefault(require("./UrlChecker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var _auth = new WeakMap();

var _excludedLinks = new WeakMap();

var _options = new WeakMap();

var _resolvePromise = new WeakMap();

var _robots = new WeakMap();

var _scanning = new WeakMap();

var _urlChecker = new WeakMap();

var _complete = new WeakSet();

var _getExcludeReason = new WeakSet();

var _isExcludedAttribute = new WeakSet();

var _maybeEnqueueLink = new WeakSet();

var _reset = new WeakSet();

class HtmlChecker extends _SafeEventEmitter.default {
  constructor(options) {
    super();

    _reset.add(this);

    _maybeEnqueueLink.add(this);

    _isExcludedAttribute.add(this);

    _getExcludeReason.add(this);

    _complete.add(this);

    _auth.set(this, {
      writable: true,
      value: void 0
    });

    _excludedLinks.set(this, {
      writable: true,
      value: void 0
    });

    _options.set(this, {
      writable: true,
      value: void 0
    });

    _resolvePromise.set(this, {
      writable: true,
      value: void 0
    });

    _robots.set(this, {
      writable: true,
      value: void 0
    });

    _scanning.set(this, {
      writable: true,
      value: void 0
    });

    _urlChecker.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _options, (0, _parseOptions.default)(options));

    _classPrivateMethodGet(this, _reset, _reset2).call(this);

    _classPrivateFieldSet(this, _urlChecker, new _UrlChecker.default(_classPrivateFieldGet(this, _options)).on(_events.ERROR_EVENT, error => this.emit(_events.ERROR_EVENT, error)).on(_events.QUEUE_EVENT, () => this.emit(_events.QUEUE_EVENT)).on(_events.LINK_EVENT, result => this.emit(_events.LINK_EVENT, result)).on(_events.END_EVENT, () => _classPrivateMethodGet(this, _complete, _complete2).call(this)));
  }

  clearCache() {
    _classPrivateFieldGet(this, _urlChecker).clearCache();

    return this;
  }

  get isPaused() {
    return _classPrivateFieldGet(this, _urlChecker).isPaused;
  }
  /**
   * Enqueue a Link if it is valid and passes filters.
   * @param {Link} link
   */


  get numActiveLinks() {
    return _classPrivateFieldGet(this, _urlChecker).numActiveLinks;
  }

  get numQueuedLinks() {
    return _classPrivateFieldGet(this, _urlChecker).numQueuedLinks;
  }

  pause() {
    _classPrivateFieldGet(this, _urlChecker).pause();

    return this;
  }

  resume() {
    _classPrivateFieldGet(this, _urlChecker).resume();

    return this;
  } // `robots` and `auth` are undocumented and for internal use only


  async scan(html, baseURL, robots, auth) {
    if (_classPrivateFieldGet(this, _scanning)) {
      throw new Error("Scan already in progress");
    } else {
      // Prevent user error with missing undocumented arugment
      if (!(robots instanceof _robotDirectives.default)) {
        robots = new _robotDirectives.default({
          userAgent: _classPrivateFieldGet(this, _options).userAgent
        });
      }

      const transitive = (0, _transitiveAuth.default)(baseURL, auth);
      baseURL = transitive.url; // @todo remove hash (and store somewhere?)

      _classPrivateFieldSet(this, _auth, transitive.auth);

      _classPrivateFieldSet(this, _robots, robots);

      _classPrivateFieldSet(this, _scanning, true);

      const document = await (0, _parseHTML.default)(html);
      const links = (0, _scrapeHTML.default)(document, baseURL, _classPrivateFieldGet(this, _robots), _classPrivateFieldGet(this, _options).autoPrefix); // @todo add auth?

      this.emit(_events.HTML_EVENT, document, _classPrivateFieldGet(this, _robots));
      links.forEach(link => _classPrivateMethodGet(this, _maybeEnqueueLink, _maybeEnqueueLink2).call(this, link));
      const resolveOnComplete = new Promise(resolve => _classPrivateFieldSet(this, _resolvePromise, resolve)); // If no links found or all links already checked

      if (_classPrivateFieldGet(this, _urlChecker).numActiveLinks === 0 && _classPrivateFieldGet(this, _urlChecker).numQueuedLinks === 0) {
        _classPrivateMethodGet(this, _complete, _complete2).call(this);
      }

      return resolveOnComplete;
    }
  }

  get __cache() {
    return _classPrivateFieldGet(this, _urlChecker).__cache;
  }

} //::: PRIVATE FUNCTIONS


exports.default = HtmlChecker;

var _complete2 = function _complete2() {
  const resolvePromise = _classPrivateFieldGet(this, _resolvePromise);

  _classPrivateMethodGet(this, _reset, _reset2).call(this);

  this.emit(_events.COMPLETE_EVENT);
  resolvePromise();
};

var _getExcludeReason2 = function _getExcludeReason2(link) {
  const attrName = link.get(_Link.HTML_ATTR_NAME);
  const attrs = link.get(_Link.HTML_ATTRS);
  const {
    href,
    protocol
  } = link.get(_Link.REBASED_URL);
  const isInternal = link.get(_Link.IS_INTERNAL);
  const tagName = link.get(_Link.HTML_TAG_NAME);

  const {
    excludedKeywords,
    excludedSchemes,
    excludeExternalLinks,
    excludeInternalLinks,
    excludeLinksToSamePage,
    honorRobotExclusions,
    includedKeywords,
    includeLink
  } = _classPrivateFieldGet(this, _options);

  if (_classPrivateMethodGet(this, _isExcludedAttribute, _isExcludedAttribute2).call(this, attrName, [tagName, "*"])) {
    return "BLC_HTML";
  } else if (excludeExternalLinks && isInternal === false) {
    return "BLC_EXTERNAL";
  } else if (excludeInternalLinks && isInternal) {
    return "BLC_INTERNAL";
  } else if (excludeLinksToSamePage && link.get(_Link.IS_SAME_PAGE)) {
    return "BLC_SAMEPAGE";
  } else if (protocol in excludedSchemes) {
    return "BLC_SCHEME";
  } else if (honorRobotExclusions && _classPrivateFieldGet(this, _robots).oneIs([_robotDirectives.NOFOLLOW, _robotDirectives.NOINDEX])) {
    return "BLC_ROBOTS";
  } else if (honorRobotExclusions && _classPrivateFieldGet(this, _robots).is(_robotDirectives.NOIMAGEINDEX) && isRobotAttr(tagName, attrName)) {
    return "BLC_ROBOTS";
  } else if (honorRobotExclusions && (attrs === null || attrs === void 0 ? void 0 : attrs.rel) != null && (0, _linkTypes.map)(attrs.rel).nofollow) {
    return "BLC_ROBOTS";
  } else if ((0, _matchURL.default)(href, excludedKeywords)) {
    return "BLC_KEYWORD";
  } else if (includedKeywords.length > 0 && !(0, _matchURL.default)(href, includedKeywords)) {
    return "BLC_KEYWORD";
  } else {
    const filterResult = includeLink(link); // Undocumented support for strings (from `SiteChecker`)

    if ((0, _isString.default)(filterResult) && filterResult in reasons) {
      return filterResult;
    } else if (!filterResult) {
      return "BLC_CUSTOM";
    } else {// Not excluded
    }
  }
};

var _isExcludedAttribute2 = function _isExcludedAttribute2(attrName, tagNames) {
  const tagGroups = _classPrivateFieldGet(this, _options).tags[_classPrivateFieldGet(this, _options).filterLevel];

  return tagNames.every(tagName => !(tagName in tagGroups) || !(attrName in tagGroups[tagName]));
};

var _maybeEnqueueLink2 = function _maybeEnqueueLink2(link) {
  if (link.get(_Link.REBASED_URL) === null) {
    link.set(_Link.HTML_OFFSET_INDEX, link.get(_Link.HTML_INDEX) - _classPrivateFieldGet(this, _excludedLinks));
    link.break("BLC_INVALID");
    link.include();
    this.emit(_events.LINK_EVENT, link);
  } else {
    const excludedReason = _classPrivateMethodGet(this, _getExcludeReason, _getExcludeReason2).call(this, link);

    if (excludedReason === undefined) {
      link.set(_Link.HTML_OFFSET_INDEX, link.get(_Link.HTML_INDEX) - _classPrivateFieldGet(this, _excludedLinks));
      link.include();

      _classPrivateFieldGet(this, _urlChecker).enqueue(link, null, _classPrivateFieldGet(this, _auth));
    } else {
      var _this$excludedLinks;

      link.set(_Link.HTML_OFFSET_INDEX, (_classPrivateFieldSet(this, _excludedLinks, (_this$excludedLinks = +_classPrivateFieldGet(this, _excludedLinks)) + 1), _this$excludedLinks));
      link.exclude(excludedReason);
      this.emit(_events.JUNK_EVENT, link);
    }
  }
};

var _reset2 = function _reset2() {
  _classPrivateFieldSet(this, _auth, null);

  _classPrivateFieldSet(this, _excludedLinks, 0);

  _classPrivateFieldSet(this, _resolvePromise, null);

  _classPrivateFieldSet(this, _robots, null);

  _classPrivateFieldSet(this, _scanning, false);
};

const isRobotAttr = (tagName, attrName) => {
  return tagName === "img" && attrName === "src" || tagName === "input" && attrName === "src" || tagName === "menuitem" && attrName === "icon" || tagName === "video" && attrName === "poster";
};

module.exports = exports.default;
//# sourceMappingURL=HtmlChecker.js.map