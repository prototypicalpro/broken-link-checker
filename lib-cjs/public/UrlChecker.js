"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _checkLink = _interopRequireDefault(require("../internal/checkLink"));

var _events = require("../internal/events");

var _isurl = _interopRequireDefault(require("isurl"));

var _Link = _interopRequireWildcard(require("../internal/Link"));

var _parseOptions = _interopRequireDefault(require("../internal/parseOptions"));

var _limitedRequestQueue = _interopRequireWildcard(require("limited-request-queue"));

var _SafeEventEmitter = _interopRequireDefault(require("../internal/SafeEventEmitter"));

var _urlcache = _interopRequireDefault(require("urlcache"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var _cache = new WeakMap();

var _linkQueue = new WeakMap();

class UrlChecker extends _SafeEventEmitter.default {
  constructor(options) {
    super();

    _cache.set(this, {
      writable: true,
      value: void 0
    });

    _linkQueue.set(this, {
      writable: true,
      value: void 0
    });

    options = (0, _parseOptions.default)(options);

    _classPrivateFieldSet(this, _cache, new _urlcache.default({
      maxAge: options.cacheMaxAge
    }));

    _classPrivateFieldSet(this, _linkQueue, new _limitedRequestQueue.default({
      maxSockets: options.maxSockets,
      maxSocketsPerHost: options.maxSocketsPerHost,
      rateLimit: options.rateLimit
    }).on(_limitedRequestQueue.ITEM_EVENT, async (url, {
      auth,
      customData,
      link
    }, done) => {
      const result = await (0, _checkLink.default)(link, auth, _classPrivateFieldGet(this, _cache), options);
      this.emit(_events.LINK_EVENT, result, customData); // Auto-starts next queue item, if any
      // Emits REQUEST_QUEUE_END_EVENT, if not

      done();
    }).on(_limitedRequestQueue.END_EVENT, () => this.emit(_events.END_EVENT)));
  }

  clearCache() {
    _classPrivateFieldGet(this, _cache).clear();

    return this;
  }

  dequeue(id) {
    const success = _classPrivateFieldGet(this, _linkQueue).dequeue(id);

    this.emit(_events.QUEUE_EVENT);
    return success;
  } // `auth` is undocumented and for internal use only


  enqueue(url, customData, auth = {}) {
    let link; // Undocumented internal use: `enqueue(Link)`

    if (url instanceof _Link.default) {
      link = url;
    } // Documented use: `enqueue(URL)`
    else if (_isurl.default.lenient(url)) {
        link = new _Link.default().resolve(url);
      } else {
        throw new TypeError("Invalid URL");
      }

    const id = _classPrivateFieldGet(this, _linkQueue).enqueue(link.get(_Link.REBASED_URL), {
      auth,
      customData,
      link
    });

    this.emit(_events.QUEUE_EVENT);
    return id;
  }

  has(id) {
    return _classPrivateFieldGet(this, _linkQueue).has(id);
  }

  get isPaused() {
    return _classPrivateFieldGet(this, _linkQueue).isPaused;
  }

  get numActiveLinks() {
    return _classPrivateFieldGet(this, _linkQueue).numActive;
  }

  get numQueuedLinks() {
    return _classPrivateFieldGet(this, _linkQueue).numQueued;
  }

  pause() {
    _classPrivateFieldGet(this, _linkQueue).pause();

    return this;
  }

  resume() {
    _classPrivateFieldGet(this, _linkQueue).resume();

    return this;
  }

  get __cache() {
    return _classPrivateFieldGet(this, _cache);
  }

}

exports.default = UrlChecker;
module.exports = exports.default;
//# sourceMappingURL=UrlChecker.js.map