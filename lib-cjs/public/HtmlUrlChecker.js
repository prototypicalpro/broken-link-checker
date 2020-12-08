"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = require("../internal/events");

var _HtmlChecker = _interopRequireDefault(require("./HtmlChecker"));

var _parseOptions = _interopRequireDefault(require("../internal/parseOptions"));

var _limitedRequestQueue = _interopRequireWildcard(require("limited-request-queue"));

var _robotDirectives = _interopRequireDefault(require("robot-directives"));

var _SafeEventEmitter = _interopRequireDefault(require("../internal/SafeEventEmitter"));

var _streamHTML = _interopRequireDefault(require("../internal/streamHTML"));

var _transitiveAuth = _interopRequireDefault(require("../internal/transitiveAuth"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var _currentAuth = new WeakMap();

var _currentCustomData = new WeakMap();

var _currentDone = new WeakMap();

var _currentPageURL = new WeakMap();

var _currentResponse = new WeakMap();

var _currentRobots = new WeakMap();

var _htmlChecker = new WeakMap();

var _htmlUrlQueue = new WeakMap();

var _options = new WeakMap();

var _appendRobotHeaders = new WeakSet();

var _completedPage = new WeakSet();

var _reset = new WeakSet();

class HtmlUrlChecker extends _SafeEventEmitter.default {
  constructor(options) {
    super();

    _reset.add(this);

    _completedPage.add(this);

    _appendRobotHeaders.add(this);

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

    _currentPageURL.set(this, {
      writable: true,
      value: void 0
    });

    _currentResponse.set(this, {
      writable: true,
      value: void 0
    });

    _currentRobots.set(this, {
      writable: true,
      value: void 0
    });

    _htmlChecker.set(this, {
      writable: true,
      value: void 0
    });

    _htmlUrlQueue.set(this, {
      writable: true,
      value: void 0
    });

    _options.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateMethodGet(this, _reset, _reset2).call(this);

    _classPrivateFieldSet(this, _options, (0, _parseOptions.default)(options));

    _classPrivateFieldSet(this, _htmlUrlQueue, new _limitedRequestQueue.default({
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

      _classPrivateFieldSet(this, _currentPageURL, url); // @todo remove hash ?


      try {
        const {
          response,
          stream
        } = await (0, _streamHTML.default)(_classPrivateFieldGet(this, _currentPageURL), _classPrivateFieldGet(this, _currentAuth), this.__cache, _classPrivateFieldGet(this, _options));

        _classPrivateFieldSet(this, _currentResponse, response);

        _classPrivateFieldSet(this, _currentRobots, new _robotDirectives.default({
          userAgent: _classPrivateFieldGet(this, _options).userAgent
        }));

        _classPrivateMethodGet(this, _appendRobotHeaders, _appendRobotHeaders2).call(this); // Passes robots instance so that headers are included in robot exclusion checks
        // @todo does the `await` cause `completedPage` to be called twice (other's in COMPLETE_EVENT) if error occurs?


        await _classPrivateFieldGet(this, _htmlChecker).scan(stream, response.url, _classPrivateFieldGet(this, _currentRobots), _classPrivateFieldGet(this, _currentAuth));
      } catch (error) {
        _classPrivateMethodGet(this, _completedPage, _completedPage2).call(this, error);
      }
    }).on(_limitedRequestQueue.END_EVENT, () => {
      // Clear references for garbage collection
      _classPrivateMethodGet(this, _reset, _reset2).call(this);

      this.emit(_events.END_EVENT);
    }));

    _classPrivateFieldSet(this, _htmlChecker, new _HtmlChecker.default(_classPrivateFieldGet(this, _options)).on(_events.ERROR_EVENT, error => this.emit(_events.ERROR_EVENT, error)).on(_events.HTML_EVENT, (tree, robots) => {
      this.emit(_events.HTML_EVENT, tree, robots, _classPrivateFieldGet(this, _currentResponse), _classPrivateFieldGet(this, _currentPageURL), _classPrivateFieldGet(this, _currentCustomData));
    }).on(_events.QUEUE_EVENT, () => this.emit(_events.QUEUE_EVENT)).on(_events.JUNK_EVENT, result => this.emit(_events.JUNK_EVENT, result, _classPrivateFieldGet(this, _currentCustomData))).on(_events.LINK_EVENT, result => this.emit(_events.LINK_EVENT, result, _classPrivateFieldGet(this, _currentCustomData))).on(_events.COMPLETE_EVENT, () => _classPrivateMethodGet(this, _completedPage, _completedPage2).call(this)));
  }
  /**
   * Append any robot headers.
   */


  clearCache() {
    _classPrivateFieldGet(this, _htmlChecker).clearCache();

    return this;
  }
  /**
   * Emit PAGE_EVENT and continue the queue.
   * @param {Error} [error]
   */


  dequeue(id) {
    const success = _classPrivateFieldGet(this, _htmlUrlQueue).dequeue(id);

    this.emit(_events.QUEUE_EVENT);
    return success;
  } // `auth` is undocumented and for internal use only


  enqueue(pageURL, customData, auth) {
    // @todo this could get messy if there're many different credentials per site (if we cache based on headers)
    const transitive = (0, _transitiveAuth.default)(pageURL, auth);

    const id = _classPrivateFieldGet(this, _htmlUrlQueue).enqueue(transitive.url, {
      auth: transitive.auth,
      customData
    });

    this.emit(_events.QUEUE_EVENT);
    return id;
  }

  has(id) {
    return _classPrivateFieldGet(this, _htmlUrlQueue).has(id);
  }

  get isPaused() {
    return _classPrivateFieldGet(this, _htmlChecker).isPaused;
  }

  get numActiveLinks() {
    return _classPrivateFieldGet(this, _htmlChecker).numActiveLinks;
  }

  get numPages() {
    return _classPrivateFieldGet(this, _htmlUrlQueue).length;
  }

  get numQueuedLinks() {
    return _classPrivateFieldGet(this, _htmlChecker).numQueuedLinks;
  }

  pause() {
    _classPrivateFieldGet(this, _htmlChecker).pause();

    _classPrivateFieldGet(this, _htmlUrlQueue).pause();

    return this;
  }

  resume() {
    _classPrivateFieldGet(this, _htmlChecker).resume();

    _classPrivateFieldGet(this, _htmlUrlQueue).resume();

    return this;
  }

  get __cache() {
    return _classPrivateFieldGet(this, _htmlChecker).__cache;
  }

}

exports.default = HtmlUrlChecker;

var _appendRobotHeaders2 = function _appendRobotHeaders2() {
  const xRobotsTag = _classPrivateFieldGet(this, _currentResponse).headers["x-robots-tag"]; // @todo https://github.com/nodejs/node/issues/3591


  if (xRobotsTag != null) {
    _classPrivateFieldGet(this, _currentRobots).header(xRobotsTag);
  }
};

var _completedPage2 = function _completedPage2(error = null) {
  // @todo emit page error instead?
  // @todo include redirected url if there is one?
  this.emit(_events.PAGE_EVENT, error, _classPrivateFieldGet(this, _currentPageURL), _classPrivateFieldGet(this, _currentCustomData)); // Auto-starts next queue item, if any
  // Emits REQUEST_QUEUE_END_EVENT, if not

  _classPrivateFieldGet(this, _currentDone).call(this);
};

var _reset2 = function _reset2() {
  _classPrivateFieldSet(this, _currentAuth, null);

  _classPrivateFieldSet(this, _currentCustomData, null);

  _classPrivateFieldSet(this, _currentDone, null);

  _classPrivateFieldSet(this, _currentPageURL, null);

  _classPrivateFieldSet(this, _currentResponse, null);

  _classPrivateFieldSet(this, _currentRobots, null);
};

module.exports = exports.default;
//# sourceMappingURL=HtmlUrlChecker.js.map