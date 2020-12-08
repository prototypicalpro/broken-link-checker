"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = require("../internal/events");

var _Link = require("../internal/Link");

var _getRobotsTxt = _interopRequireDefault(require("../internal/getRobotsTxt"));

var _HtmlUrlChecker = _interopRequireDefault(require("./HtmlUrlChecker"));

var _parseOptions = _interopRequireDefault(require("../internal/parseOptions"));

var _limitedRequestQueue = _interopRequireWildcard(require("limited-request-queue"));

var _SafeEventEmitter = _interopRequireDefault(require("../internal/SafeEventEmitter"));

var _transitiveAuth = _interopRequireDefault(require("../internal/transitiveAuth"));

var _urlcache = _interopRequireDefault(require("urlcache"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

// @todo BLC_ROBOTS catches rel=nofollow links but will also catch meta/header excluded links -- fine?
const PAGE_EXCLUSIONS = ["BLC_KEYWORD", "BLC_ROBOTS", "BLC_SCHEME"];
const PAGE_WAS_CHECKED = true;

var _currentAuth = new WeakMap();

var _currentCustomData = new WeakMap();

var _currentDone = new WeakMap();

var _currentPageError = new WeakMap();

var _currentRobotsTxt = new WeakMap();

var _currentSiteURL = new WeakMap();

var _htmlUrlChecker = new WeakMap();

var _options = new WeakMap();

var _sitePagesChecked = new WeakMap();

var _siteUrlQueue = new WeakMap();

var _enqueuePage = new WeakSet();

var _getExcludedReason = new WeakSet();

var _isAllowed = new WeakSet();

var _maybeEnqueuePage = new WeakSet();

var _overrideOptions = new WeakSet();

var _reset = new WeakSet();

class SiteChecker extends _SafeEventEmitter.default {
  constructor(_options2) {
    super();

    _reset.add(this);

    _overrideOptions.add(this);

    _maybeEnqueuePage.add(this);

    _isAllowed.add(this);

    _getExcludedReason.add(this);

    _enqueuePage.add(this);

    _currentAuth.set(this, {
      writable: true,
      value: void 0
    });

    _currentCustomData.set(this, {
      writable: true,
      value: void 0
    });

    _currentDone.set(this, {
      writable: true,
      value: void 0
    });

    _currentPageError.set(this, {
      writable: true,
      value: void 0
    });

    _currentRobotsTxt.set(this, {
      writable: true,
      value: void 0
    });

    _currentSiteURL.set(this, {
      writable: true,
      value: void 0
    });

    _htmlUrlChecker.set(this, {
      writable: true,
      value: void 0
    });

    _options.set(this, {
      writable: true,
      value: void 0
    });

    _sitePagesChecked.set(this, {
      writable: true,
      value: void 0
    });

    _siteUrlQueue.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _options, _classPrivateMethodGet(this, _overrideOptions, _overrideOptions2).call(this, (0, _parseOptions.default)(_options2))); // @todo https://github.com/tc39/proposal-pipeline-operator


    _classPrivateFieldSet(this, _sitePagesChecked, new _urlcache.default({
      maxAge: _classPrivateFieldGet(this, _options).cacheMaxAge
    }));

    _classPrivateMethodGet(this, _reset, _reset2).call(this);

    _classPrivateFieldSet(this, _siteUrlQueue, new _limitedRequestQueue.default({
      maxSockets: 1,
      rateLimit: _classPrivateFieldGet(this, _options).rateLimit
    }).on(_limitedRequestQueue.ITEM_EVENT, async (url, {
      auth,
      customData
    }, done) => {
      _classPrivateMethodGet(this, _reset, _reset2).call(this);

      _classPrivateFieldSet(this, _currentAuth, auth);

      _classPrivateFieldSet(this, _currentCustomData, customData);

      _classPrivateFieldSet(this, _currentDone, done);

      _classPrivateFieldSet(this, _currentSiteURL, url); // @todo strip after hostname?


      try {
        if (_classPrivateFieldGet(this, _options).honorRobotExclusions) {
          const robots = await (0, _getRobotsTxt.default)(_classPrivateFieldGet(this, _currentSiteURL), _classPrivateFieldGet(this, _currentAuth), this.__cache, _classPrivateFieldGet(this, _options)); // This receives an instance even if no robots.txt was found

          _classPrivateFieldSet(this, _currentRobotsTxt, robots);

          this.emit(_events.ROBOTS_EVENT, robots, _classPrivateFieldGet(this, _currentCustomData));
        }
      } catch (_unused) {// If could not connect to server -- let `HtmlUrlChecker` catch it
      } finally {
        _classPrivateMethodGet(this, _enqueuePage, _enqueuePage2).call(this, _classPrivateFieldGet(this, _currentSiteURL), _classPrivateFieldGet(this, _currentCustomData), _classPrivateFieldGet(this, _currentAuth));
      }
    }).on(_limitedRequestQueue.END_EVENT, () => {
      // Clear references for garbage collection
      _classPrivateMethodGet(this, _reset, _reset2).call(this);

      this.emit(_events.END_EVENT);
    }));

    _classPrivateFieldSet(this, _htmlUrlChecker, new _HtmlUrlChecker.default(_classPrivateFieldGet(this, _options)).on(_events.ERROR_EVENT, error => this.emit(_events.ERROR_EVENT, error)).on(_events.HTML_EVENT, (tree, robots, response, pageURL, customData) => {
      // If was redirected
      if (response.url !== pageURL) {
        _classPrivateFieldGet(this, _sitePagesChecked).set(response.url, PAGE_WAS_CHECKED); // Avoid rechecking any redirected pages


        response.redirects.forEach(redirect => _classPrivateFieldGet(this, _sitePagesChecked).set(redirect.url, PAGE_WAS_CHECKED));
      }

      this.emit(_events.HTML_EVENT, tree, robots, response, pageURL, customData);
    }).on(_events.QUEUE_EVENT, () => this.emit(_events.QUEUE_EVENT)).on(_events.JUNK_EVENT, (result, customData) => {
      this.emit(_events.JUNK_EVENT, result, customData);

      _classPrivateMethodGet(this, _maybeEnqueuePage, _maybeEnqueuePage2).call(this, result, customData, _classPrivateFieldGet(this, _currentAuth));
    }).on(_events.LINK_EVENT, (result, customData) => {
      this.emit(_events.LINK_EVENT, result, customData);

      _classPrivateMethodGet(this, _maybeEnqueuePage, _maybeEnqueuePage2).call(this, result, customData, _classPrivateFieldGet(this, _currentAuth));
    }).on(_events.PAGE_EVENT, (error, pageURL, customData) => {
      this.emit(_events.PAGE_EVENT, error, pageURL, customData); // Only the first page should supply an error to SITE_EVENT

      if (_classPrivateFieldGet(this, _sitePagesChecked).length <= 1) {
        _classPrivateFieldSet(this, _currentPageError, error);
      }
    }).on(_events.END_EVENT, () => {
      this.emit(_events.SITE_EVENT, _classPrivateFieldGet(this, _currentPageError), _classPrivateFieldGet(this, _currentSiteURL), _classPrivateFieldGet(this, _currentCustomData)); // Auto-starts next site, if any
      // Emits REQUEST_QUEUE_END_EVENT, if not

      _classPrivateFieldGet(this, _currentDone).call(this);
    }));
  }

  clearCache() {
    // Does not clear `sitePagesChecked` because it would mess up any current scans
    _classPrivateFieldGet(this, _htmlUrlChecker).clearCache();

    return this;
  }

  dequeue(id) {
    const success = _classPrivateFieldGet(this, _siteUrlQueue).dequeue(id);

    this.emit(_events.QUEUE_EVENT);
    return success;
  }

  enqueue(firstPageURL, customData) {
    const transitive = (0, _transitiveAuth.default)(firstPageURL);

    const success = _classPrivateFieldGet(this, _siteUrlQueue).enqueue(transitive.url, {
      auth: transitive.auth,
      customData
    });

    this.emit(_events.QUEUE_EVENT);
    return success;
  }
  /**
   * Enqueue a URL to be crawled.
   * @param {URL} url
   * @param {*} customData
   * @param {object} auth
   */


  has(id) {
    return _classPrivateFieldGet(this, _siteUrlQueue).has(id);
  }
  /**
   * Determine whether a Link should be included, conforming to any robots filter.
   * @param {Link} link
   * @returns {boolean}
   */


  get isPaused() {
    return _classPrivateFieldGet(this, _htmlUrlChecker).isPaused;
  }
  /**
   * Enqueue a page (to be crawled) if it passes filters.
   * @param {Link} link
   * @param {*} customData
   * @param {object} auth
   */


  get numActiveLinks() {
    return _classPrivateFieldGet(this, _htmlUrlChecker).numActiveLinks;
  }

  get numQueuedLinks() {
    return _classPrivateFieldGet(this, _htmlUrlChecker).numQueuedLinks;
  }

  get numPages() {
    return _classPrivateFieldGet(this, _htmlUrlChecker).numPages;
  }

  get numSites() {
    return _classPrivateFieldGet(this, _siteUrlQueue).length;
  }
  /**
   * Override/mutate some options for extended behavior.
   * @param {object} options
   * @returns {object}
   */


  pause() {
    _classPrivateFieldGet(this, _htmlUrlChecker).pause();

    _classPrivateFieldGet(this, _siteUrlQueue).pause();

    return this;
  }

  resume() {
    _classPrivateFieldGet(this, _htmlUrlChecker).resume();

    _classPrivateFieldGet(this, _siteUrlQueue).resume();

    return this;
  } // Useless, but consistent with other classes


  get __cache() {
    return _classPrivateFieldGet(this, _htmlUrlChecker).__cache;
  }

}

exports.default = SiteChecker;

var _enqueuePage2 = function _enqueuePage2(url, customData, auth) {
  // Avoid links to self within page
  _classPrivateFieldGet(this, _sitePagesChecked).set(url, PAGE_WAS_CHECKED);

  _classPrivateFieldGet(this, _htmlUrlChecker).enqueue(url, customData, auth);
};

var _getExcludedReason2 = function _getExcludedReason2(link) {
  if (link.get(_Link.IS_INTERNAL) && !_classPrivateMethodGet(this, _isAllowed, _isAllowed2).call(this, link)) {
    return "BLC_ROBOTS";
  } else {// Not excluded
  }
};

var _isAllowed2 = function _isAllowed2(link) {
  if (_classPrivateFieldGet(this, _options).honorRobotExclusions) {
    var _link$get;

    const rebasedPathname = (_link$get = link.get(_Link.REBASED_URL)) === null || _link$get === void 0 ? void 0 : _link$get.pathname; // @todo remove condition when/if `Link::invalidate()` is used in `HtmlChecker`

    if (rebasedPathname !== null) {
      return _classPrivateFieldGet(this, _currentRobotsTxt).isAllowed(_classPrivateFieldGet(this, _options).userAgent, rebasedPathname);
    } else {
      return true;
    }
  } else {
    return true;
  }
};

var _maybeEnqueuePage2 = function _maybeEnqueuePage2(link, customData, auth) {
  // Skip specific links that were excluded from checks
  if (link.get(_Link.WAS_EXCLUDED) && PAGE_EXCLUSIONS.includes(link.get(_Link.EXCLUDED_REASON))) {// do nothing
  } else {
    var _classPrivateFieldGet2;

    const tagGroup = (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _options).tags.recursive[_classPrivateFieldGet(this, _options).filterLevel][link.get(_Link.HTML_TAG_NAME)]) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : {};
    const attrSupported = (link.get(_Link.HTML_ATTR_NAME) in tagGroup);
    const rebasedURL = link.get(_Link.REBASED_URL);
    const redirectedURL = link.get(_Link.REDIRECTED_URL);

    if (!attrSupported || link.get(_Link.IS_BROKEN) || !link.get(_Link.IS_INTERNAL) || _classPrivateFieldGet(this, _sitePagesChecked).has(rebasedURL) || !_classPrivateMethodGet(this, _isAllowed, _isAllowed2).call(this, link)) {// do nothing
    } else if (redirectedURL !== null) {
      // Because only the final redirected page needs to be [recursively] checked,
      // all redirects are stored as pages that have been checked
      link.get(_Link.HTTP_RESPONSE).redirects.forEach(({
        url
      }) => _classPrivateFieldGet(this, _sitePagesChecked).set(url, PAGE_WAS_CHECKED));

      if (!_classPrivateFieldGet(this, _sitePagesChecked).has(redirectedURL)) {
        _classPrivateMethodGet(this, _enqueuePage, _enqueuePage2).call(this, redirectedURL, customData, auth);
      }
    } else if (_classPrivateFieldGet(this, _options).includePage(rebasedURL)) {
      _classPrivateMethodGet(this, _enqueuePage, _enqueuePage2).call(this, rebasedURL, customData, auth);
    }
  }
};

var _overrideOptions2 = function _overrideOptions2(options) {
  const {
    includeLink
  } = options;

  options.includeLink = link => {
    const excludedReason = _classPrivateMethodGet(this, _getExcludedReason, _getExcludedReason2).call(this, link);

    if (excludedReason === undefined) {
      return includeLink(link);
    } else {
      // Undocumented return value type
      return excludedReason;
    }
  };

  return options;
};

var _reset2 = function _reset2() {
  _classPrivateFieldSet(this, _currentAuth, null);

  _classPrivateFieldSet(this, _currentCustomData, null);

  _classPrivateFieldSet(this, _currentDone, null);

  _classPrivateFieldSet(this, _currentPageError, null);

  _classPrivateFieldSet(this, _currentRobotsTxt, null);

  _classPrivateFieldSet(this, _currentSiteURL, null);

  _classPrivateFieldGet(this, _sitePagesChecked).clear();
};

module.exports = exports.default;
//# sourceMappingURL=SiteChecker.js.map