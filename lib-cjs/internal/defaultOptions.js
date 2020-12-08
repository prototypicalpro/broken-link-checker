"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepFreezeNode = _interopRequireDefault(require("deep-freeze-node"));

var _methods = require("./methods");

var _package = require("../../package.json");

var _tags = _interopRequireDefault(require("./tags"));

var _defaultUserAgent = _interopRequireDefault(require("default-user-agent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _deepFreezeNode.default)({
  acceptedSchemes: ["http:", "https:"],
  // @todo add "file:"
  autoPrefix: null,
  cacheMaxAge: 3600000,
  cacheResponses: true,
  excludedKeywords: [],
  excludedSchemes: ["data:", "geo:", "javascript:", "mailto:", "sms:", "tel:"],
  excludeExternalLinks: false,
  excludeInternalLinks: false,
  excludeLinksToSamePage: false,
  filterLevel: 1,
  honorRobotExclusions: true,
  includedKeywords: [],
  includeLink: () => true,
  includePage: () => true,
  maxSockets: Infinity,
  // @todo change to `maxExternalSockets`
  maxSocketsPerHost: 1,
  // @todo separate to `maxInternalSockets=5` and `maxExternalSocketsPerHost=1`
  rateLimit: 0,
  requestMethod: _methods.HEAD_METHOD,
  retryHeadCodes: [405],
  retryHeadFail: true,
  tags: _tags.default,
  userAgent: (0, _defaultUserAgent.default)(_package.name, _package.version)
});

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=defaultOptions.js.map