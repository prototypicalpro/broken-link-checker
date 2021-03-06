"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _reasons = require("./reasons");

var _methods = require("./methods");

var _isurl = _interopRequireDefault(require("isurl"));

var _got = require("got");

var _autoTunnel = _interopRequireDefault(require("auto-tunnel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERROR_EVENT = "error";
const REDIRECT_EVENT = "redirect";
const RESPONSE_EVENT = "response";
/**
 * Create an HTTP request.
 * @param {URL} url
 * @param {object} auth
 * @param {string} method
 * @param {object} options
 * @param {boolean} [retry]
 * @returns {Promise<object>}
 */

const createRequest = (url, auth, method, options, retry = false) => new Promise((resolve, reject) => {
  const headers = {
    "user-agent": options.userAgent
  };
  const redirects = [];
  (0, _got.stream)(url, {
    agent: (0, _autoTunnel.default)(url, {
      proxyHeaders: headers
    }),
    auth: stringifyAuth(url, auth),
    headers,
    method,
    rejectUnauthorized: false,
    // accept self-signed SSL certificates
    retries: 0,
    // explicit; they're already disabled for streams
    throwHttpErrors: false
  }).on(ERROR_EVENT, reject).on(REDIRECT_EVENT, stream => redirects.push(simplifyResponse(stream))).on(RESPONSE_EVENT, stream => {
    const response = simplifyResponse(stream, redirects);

    if (!retry && method === _methods.HEAD_METHOD && options.retryHeadFail && options.retryHeadCodes.includes(response.status)) {
      // Retry potentially broken server with GET_METHOD
      resolve(createRequest(url, auth, _methods.GET_METHOD, options, true));
    } else if (method === _methods.GET_METHOD && response.status >= 200 && response.status <= 299) {
      resolve({
        response,
        stream
      });
    } else {
      resolve({
        response
      });
    }
  });
});
/**
 * Create a simple response object from that of the "http" module.
 * @param {object|Stream} response
 * @param {Array<object>} [redirects]
 * @returns {object}
 * @todo add response time -- https://github.com/sindresorhus/got/issues/874
 */


const simplifyResponse = ({
  headers,
  statusCode,
  statusMessage,
  url
}, redirects) => ({
  headers,
  status: statusCode,
  statusText: statusMessage,
  url: new URL(url),
  ...(redirects && {
    redirects
  })
});
/**
 * Convert an HTTP authentication URL or object into a string.
 * @param {URL} url
 * @param {object} auth
 * @returns {string}
 */


const stringifyAuth = (url, auth) => {
  if (url.password !== "" || url.username !== "") {
    return `${url.username}:${url.password}`;
  } else if (auth.password !== "" || auth.username !== "") {
    return `${auth.username}:${auth.password}`;
  }
};
/**
 * Create an HTTP request and optionally cache the response.
 * @param {URL} url
 * @param {object} auth
 * @param {string} method
 * @param {URLCache} cache
 * @param {object} options
 * @throws {TypeError} non-URL
 * @returns {Promise<object>}
 * @todo use `Promise.try()` instead of `async`
 */


var _default = async (url, auth, method, cache, options) => {
  if (!_isurl.default.lenient(url)) {
    throw new TypeError(_reasons.BLC_INVALID);
  } else {
    const promise = createRequest(url, auth, method.toLowerCase(), options);

    if (options.cacheResponses) {
      const cachedPromise = promise.then(({
        response
      }) => {
        // Replace cached promise
        // @todo store in a "response" key, so that we can also store a list of all element IDs in the document
        cache.set(url, response); // Any final redirect
        // @todo store in a "response" key, so that we can also store a list of all element IDs in the document

        cache.set(response.url, response); // Any intermediary redirects

        response.redirects.forEach((redirect, i) => {
          const subsequentRedirects = response.redirects.slice(i + 1); // @todo store in a "response" key, so that we can also store a list of all element IDs in the document

          cache.set(redirect.url, { ...response,
            redirects: subsequentRedirects
          });
        });
        return response;
      }).catch(error => error); // pass-through
      // Make future response available to other requests before completion
      // Will always overwrite previous value
      // @todo store in a "response" key, so that we can also store a list of all element IDs in the document

      cache.set(url, cachedPromise);
    }

    return promise;
  }
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=requestHTTP.js.map