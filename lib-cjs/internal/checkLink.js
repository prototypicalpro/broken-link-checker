"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

var _lodash = require("lodash");

var _Link = _interopRequireWildcard(require("./Link"));

var _requestHTTP = _interopRequireDefault(require("./requestHTTP"));

var _urlRelation = _interopRequireDefault(require("url-relation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//import {join as joinPath} from "path";
//import {promises as fs} from "fs";
//const {stat:statFile} = fs;

/**
 * Check a link on the local file system.
 * @param {Link} link
 * @param {URLCache} cache
 * @param {object} options
 * @returns {Promise<Link>}
 */

/*const checkFile = async (link, cache, options) =>
{
	try
	{
		const {isFile} = await statFile(link.get(REBASED_URL).pathname);

		if (!isFile())
		{
			//throw new Error("ERRNOTFOUND");
		}

		link.mend();
	}
	catch ({code})
	{
		link.break(`ERRNO_${code}`);
	}
	finally
	{
		return link;
	}
};*/

/**
 * Check a link via HTTP.
 * @param {Link} link
 * @param {object} auth
 * @param {URLCache} cache
 * @param {object} options
 * @returns {Promise<Link>}
 */
const checkHTTP = async (link, auth, cache, options) => {
  const result = await (0, _requestHTTP.default)(link.get(_Link.REBASED_URL), auth, options.requestMethod, cache, options).then(({
    response
  }) => response) // exclude any stream
  .catch(error => error);
  copyResponseData(result, link, options);
  link.set(_Link.HTTP_RESPONSE_WAS_CACHED, false);
  return link;
};
/**
 * Copy data from a cached or uncached response into a Link.
 * @param {object|Error} response
 * @param {Link} link
 * @param {object} options
 */


const copyResponseData = (response, link, {
  cacheResponses
}) => {
  if (response instanceof Error) {
    link.break(`ERRNO_${response.code}`);
  } else {
    if (response.status < 200 || response.status > 299) {
      link.break(`HTTP_${response.status}`);
    } else {
      link.mend();
    } // @todo would a string check be sufficient?


    if (!_urlRelation.default.match(response.url, link.get(_Link.REBASED_URL), {
      targetComponent: _urlRelation.default.PATH
    })) {
      // @todo this needs a test
      // @todo test if redirected to a different protocol
      link.redirect(response.url);
    }

    if (cacheResponses) {
      // Avoid potential mutations to cache
      response = (0, _lodash.cloneDeep)(response);
    }

    link.set(_Link.HTTP_RESPONSE, response);
  }
};
/**
 * Check a link's URL to see if it is broken or not.
 * @param {Link} link
 * @param {object} auth
 * @param {URLCache} cache
 * @param {object} options
 * @throws {TypeError} non-Link
 * @returns {Promise<Link>}
 */


var _default = async (link, auth, cache, options) => {
  if (!(link instanceof _Link.default)) {
    throw new TypeError("Invalid Link");
  } else {
    var _link$get;

    let output; // @todo move out to a `Link::invalidate()` to share with `HtmlChecker()` ?

    if (!(((_link$get = link.get(_Link.REBASED_URL)) === null || _link$get === void 0 ? void 0 : _link$get.protocol) in options.acceptedSchemes)) {
      link.break("BLC_INVALID");
      output = link;
    } else if (options.cacheResponses) {
      // @todo different auths can have different responses
      const result = cache.get(link.get(_Link.REBASED_URL));

      if (result !== undefined) {
        copyResponseData(await result, link, options);
        link.set(_Link.HTTP_RESPONSE_WAS_CACHED, true);
        output = link;
      }
    }

    if (output) {
      return output;
    } else {
      /*switch (link.get(REBASED_URL).protocol)
      {
      	"file:":  return checkFile(link, cache, options);
      		"http:":
      	"https:":*/
      return checkHTTP(link, auth, cache, options); //}
    }
  }
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=checkLink.js.map