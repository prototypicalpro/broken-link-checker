"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _errors = require("./errors");

var _methods = require("./methods");

var _requestHTTP = _interopRequireDefault(require("./requestHTTP"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CONTENT_TYPE = "content-type";
const HTML_MIMETYPE = "text/html";
/**
 * Request a URL for its HTML contents.
 * @param {URL} url
 * @param {object} auth
 * @param {URLCache} cache
 * @param {object} options
 * @throws {ExpectedHTMLError} if not HTML mimetype
 * @throws {HTMLRetrievalError} 404, etc
 * @returns {Promise<Stream>}
 */

var _default = async (url, auth, cache, options) => {
  const result = await (0, _requestHTTP.default)(url, auth, _methods.GET_METHOD, cache, options);
  const {
    response: {
      headers,
      status
    }
  } = result;

  if (status < 200 || status > 299) {
    throw new _errors.HTMLRetrievalError(status);
  } else {
    const type = headers[CONTENT_TYPE]; // Content-type is not mandatory in HTTP spec

    if (!(type !== null && type !== void 0 && type.startsWith(HTML_MIMETYPE))) {
      throw new _errors.ExpectedHTMLError(type, status);
    }
  }

  return result;
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=streamHTML.js.map