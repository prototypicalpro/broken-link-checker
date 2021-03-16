"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EXCLUDED_REASON = exports.BROKEN_REASON = exports.WAS_EXCLUDED = exports.IS_SAME_PAGE = exports.IS_INTERNAL = exports.IS_BROKEN = exports.HTTP_RESPONSE_WAS_CACHED = exports.HTTP_RESPONSE = exports.HTML_BASE_HREF = exports.HTML_TAG = exports.HTML_TEXT = exports.HTML_ATTRS = exports.HTML_ATTR_NAME = exports.HTML_TAG_NAME = exports.HTML_SELECTOR = exports.HTML_LOCATION = exports.HTML_OFFSET_INDEX = exports.HTML_INDEX = exports.REBASED_BASE_URL = exports.RESOLVED_BASE_URL = exports.REDIRECTED_URL = exports.REBASED_URL = exports.RESOLVED_URL = exports.ORIGINAL_URL = void 0;

require("core-js/modules/es.object.from-entries.js");

var reasons = _interopRequireWildcard(require("./reasons"));

var _isurl = _interopRequireDefault(require("isurl"));

var _urlRelation = _interopRequireDefault(require("url-relation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

const ORIGINAL_URL = "originalURL"; // The URL string as it was inputted

exports.ORIGINAL_URL = ORIGINAL_URL;
const RESOLVED_URL = "resolvedURL"; // The `URL`, resolved with `RESOLVED_BASE_URL`

exports.RESOLVED_URL = RESOLVED_URL;
const REBASED_URL = "rebasedURL"; // The `URL`, resolved with `REBASED_BASE_URL`

exports.REBASED_URL = REBASED_URL;
const REDIRECTED_URL = "redirectedURL"; // The `URL`, after its last redirection, if any

exports.REDIRECTED_URL = REDIRECTED_URL;
const RESOLVED_BASE_URL = "resolvedBaseURL"; // The base `URL`

exports.RESOLVED_BASE_URL = RESOLVED_BASE_URL;
const REBASED_BASE_URL = "rebasedBaseURL"; // The base `URL`, resolved with `HTML_BASE_HREF`

exports.REBASED_BASE_URL = REBASED_BASE_URL;
const HTML_INDEX = "htmlIndex"; // The order in which the link appeared in its document -- using max-level tag filter

exports.HTML_INDEX = HTML_INDEX;
const HTML_OFFSET_INDEX = "htmlOffsetIndex"; // Sequential (gap-free) indices for skipped and unskipped links

exports.HTML_OFFSET_INDEX = HTML_OFFSET_INDEX;
const HTML_LOCATION = "htmlLocation"; // Source code location of the attribute that the link was found within

exports.HTML_LOCATION = HTML_LOCATION;
const HTML_SELECTOR = "htmlSelector"; // CSS selector for element in document

exports.HTML_SELECTOR = HTML_SELECTOR;
const HTML_TAG_NAME = "htmlTagName"; // Tag name that the link was found on

exports.HTML_TAG_NAME = HTML_TAG_NAME;
const HTML_ATTR_NAME = "htmlAttrName"; // Attribute name that the link was found within

exports.HTML_ATTR_NAME = HTML_ATTR_NAME;
const HTML_ATTRS = "htmlAttrs"; // All attributes on the element

exports.HTML_ATTRS = HTML_ATTRS;
const HTML_TEXT = "htmlText"; // TextNodes/innerText of the element

exports.HTML_TEXT = HTML_TEXT;
const HTML_TAG = "htmlTag"; // The entire tag string

exports.HTML_TAG = HTML_TAG;
const HTML_BASE_HREF = "htmlBaseHref"; // The document's `<base href>` value

exports.HTML_BASE_HREF = HTML_BASE_HREF;
const HTTP_RESPONSE = "httpResponse"; // The request response

exports.HTTP_RESPONSE = HTTP_RESPONSE;
const HTTP_RESPONSE_WAS_CACHED = "httpResponseWasCached"; // If the response was from cache

exports.HTTP_RESPONSE_WAS_CACHED = HTTP_RESPONSE_WAS_CACHED;
const IS_BROKEN = "isBroken"; // If the link was determined to be broken or not

exports.IS_BROKEN = IS_BROKEN;
const IS_INTERNAL = "isInternal"; // If the link is to the same host as its base/document

exports.IS_INTERNAL = IS_INTERNAL;
const IS_SAME_PAGE = "isSamePage"; // If the link is to the same page as its base/document

exports.IS_SAME_PAGE = IS_SAME_PAGE;
const WAS_EXCLUDED = "wasExcluded"; // If the link was excluded due to any filtering

exports.WAS_EXCLUDED = WAS_EXCLUDED;
const BROKEN_REASON = "brokenReason"; // The reason why the link was considered broken, if it indeed is

exports.BROKEN_REASON = BROKEN_REASON;
const EXCLUDED_REASON = "excludedReason"; // The reason why the link was excluded from being checked, if it indeed was

exports.EXCLUDED_REASON = EXCLUDED_REASON;

var _relateWithBase = new WeakSet();

class Link extends Map {
  /**
   * @param {Link} [link]
   */
  constructor(link) {
    super(link);

    _relateWithBase.add(this);

    if (!(link instanceof Link)) {
      // Default values
      keysAsList.forEach(key => super.set(key, null));
    }
  }
  /**
   * Change state to "broken" with a reason.
   * @param {string} reasonKey
   * @returns {Link}
   */


  break(reasonKey) {
    if (!(reasonKey in reasons)) {
      reasonKey = "BLC_UNKNOWN";
    }

    super.set(IS_BROKEN, true);
    super.set(BROKEN_REASON, reasonKey);
    return this;
  }
  /**
   * Change state to "excluded" with a reason.
   * @param {string} reasonKey
   * @returns {Link}
   */


  exclude(reasonKey) {
    super.set(WAS_EXCLUDED, true);
    super.set(EXCLUDED_REASON, reasonKey);
    return this;
  }
  /**
   * Change state to "not excluded" and remove any previous reason for being otherwise.
   * @returns {Link}
   */


  include() {
    super.set(WAS_EXCLUDED, false);
    super.set(EXCLUDED_REASON, null);
    return this;
  }
  /**
   * Change state to "not broken" and remove any previous reason for being otherwise.
   * @returns {Link}
   */


  mend() {
    super.set(IS_BROKEN, false);
    super.set(BROKEN_REASON, null);
    return this;
  }
  /**
   * Assign a redirected URL and change any relative state.
   * @param {URL|string} url
   * @returns {Link}
   */


  redirect(url) {
    super.set(REDIRECTED_URL, parseURL(url));

    _classPrivateMethodGet(this, _relateWithBase, _relateWithBase2).call(this);

    return this;
  }
  /**
   * Reassign properties associated with state relative to the link's environment.
   */


  /**
   * Produce and assign an absolute URL and change any relative state.
   * @param {URL|string} url
   * @param {URL|string} base
   * @param {{pattern: RegExp, prefix: string}[]} [autoPrefix]
   * @returns {Link}
   */
  resolve(url, base, autoPrefix = null) {
    if (url != null) {
      // Parse or clone
      base = parseURL(base, null, autoPrefix);

      if (_isurl.default.lenient(url)) {
        super.set(ORIGINAL_URL, url.href);
        super.set(RESOLVED_URL, url);
      } else {
        super.set(ORIGINAL_URL, url);
        super.set(RESOLVED_URL, parseURL(url, null, autoPrefix));
      }

      if (base !== null) {
        // Remove any hash since it's useless in a base -- safe to mutate
        base.hash = "";
        const rebased = parseURL(super.get(HTML_BASE_HREF), base);
        super.set(REBASED_BASE_URL, rebased !== null && rebased !== void 0 ? rebased : base);
        super.set(RESOLVED_BASE_URL, base);
      } else {
        super.set(REBASED_BASE_URL, parseURL(super.get(HTML_BASE_HREF)));
      }

      if (super.get(REBASED_BASE_URL) !== null) {
        // Remove any hash since it's useless in a base -- safe to mutate
        super.get(REBASED_BASE_URL).hash = "";

        if (super.get(RESOLVED_URL) === null) {
          super.set(RESOLVED_URL, parseURL(url, super.get(RESOLVED_BASE_URL), autoPrefix));
          super.set(REBASED_URL, parseURL(url, super.get(REBASED_BASE_URL), autoPrefix));
        } else {
          super.set(REBASED_URL, super.get(RESOLVED_URL));
        }
      } else {
        super.set(REBASED_URL, super.get(RESOLVED_URL));
      } // @todo move relation stuff out of this function -- separation of concerns?


      _classPrivateMethodGet(this, _relateWithBase, _relateWithBase2).call(this);
    }

    return this;
  }
  /**
   * Assign a value to a supported key.
   * @param {symbol} key
   * @param {*} value
   * @throws {TypeError} unsupported key or undefined value
   * @returns {Link}
   */


  set(key, value) {
    if (!(key in keysAsKeys)) {
      throw new TypeError("Invalid key");
    } else if (value === undefined) {
      throw new TypeError("Invalid value");
    } else {
      return super.set(key, value);
    }
  }
  /**
   * Produce a key-value object for `JSON.stringify()`.
   * @returns {object}
   */


  toJSON() {
    // @todo https://github.com/tc39/proposal-pipeline-operator
    return Object.fromEntries(Array.from(super.entries()));
  }

}

exports.default = Link;

function _relateWithBase2() {
  var _get$call;

  const url = (_get$call = _get(_getPrototypeOf(Link.prototype), "get", this).call(this, REDIRECTED_URL)) !== null && _get$call !== void 0 ? _get$call : _get(_getPrototypeOf(Link.prototype), "get", this).call(this, REBASED_URL); // If impossible to determine is linked to same server/etc

  if (url === null || _get(_getPrototypeOf(Link.prototype), "get", this).call(this, RESOLVED_BASE_URL) === null) {
    // Overwrite any previous values
    _get(_getPrototypeOf(Link.prototype), "set", this).call(this, IS_INTERNAL, null);

    _get(_getPrototypeOf(Link.prototype), "set", this).call(this, IS_SAME_PAGE, null);
  } else {
    // Rebased base URL not used because `<base href>` URL could be remote
    // @todo common/careful profile
    // @todo auth shouldn't affect this
    const relation = new _urlRelation.default(url, _get(_getPrototypeOf(Link.prototype), "get", this).call(this, RESOLVED_BASE_URL));

    _get(_getPrototypeOf(Link.prototype), "set", this).call(this, IS_INTERNAL, relation.upTo(_urlRelation.default.HOST));

    _get(_getPrototypeOf(Link.prototype), "set", this).call(this, IS_SAME_PAGE, relation.upTo(_urlRelation.default.PATH));
  }
}

const keysAsValues = {
  BROKEN_REASON,
  EXCLUDED_REASON,
  HTML_ATTR_NAME,
  HTML_ATTRS,
  HTML_BASE_HREF,
  HTML_INDEX,
  HTML_LOCATION,
  HTML_OFFSET_INDEX,
  HTML_SELECTOR,
  HTML_TAG,
  HTML_TAG_NAME,
  HTML_TEXT,
  HTTP_RESPONSE,
  HTTP_RESPONSE_WAS_CACHED,
  IS_BROKEN,
  IS_INTERNAL,
  IS_SAME_PAGE,
  ORIGINAL_URL,
  REBASED_BASE_URL,
  REBASED_URL,
  REDIRECTED_URL,
  RESOLVED_BASE_URL,
  RESOLVED_URL,
  WAS_EXCLUDED
};
const keysAsList = Object.values(keysAsValues);
const keysAsKeys = keysAsList.reduce((result, value) => {
  result[value] = true; // memoized value

  return result;
}, {});
/**
 * Parse or clone a URL.
 * @param {URL|string|null} [url]
 * @param {URL|string|null} [base]
 * @param {{pattern: RegExp, prefix: string}[]} [autoprefix] Whether or not to automatically attempt adding https:// to the URL if parsing fails.
 * @returns {URL|null}
 */

const parseURL = (url = null, base, autoprefix = null) => {
  if (url !== null) {
    try {
      url = new URL(url, base || undefined);
    } catch (_unused) {
      if (!_isurl.default.lenient(url) && (autoprefix === null || autoprefix === void 0 ? void 0 : autoprefix.length) > 0) {
        for (const {
          pattern,
          prefix
        } of autoprefix) {
          if (pattern.test(url)) {
            try {
              url = new URL(`${prefix}${url}`);
              break;
            } catch (_unused2) {}
          }
        }
      }
    }
  }

  if (!_isurl.default.lenient(url)) url = null;
  return url;
};

Object.freeze(Link);
//# sourceMappingURL=Link.js.map