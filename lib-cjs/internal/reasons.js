"use strict";

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.object.from-entries");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errno = require("errno");

var _http = require("http");

var _default = Object.freeze({
  BLC_CUSTOM: "Custom Exclusion",
  BLC_EXTERNAL: "External URL Exclusion",
  //BLC_LOCAL_EXCLUSION: "Local File System Path Exclusion",
  BLC_HTML: "HTML Exclusion",
  BLC_INTERNAL: "Internal URL Exclusion",
  BLC_INVALID: "Invalid URL",
  BLC_KEYWORD: "Keyword Exclusion",
  BLC_ROBOTS: "Robots Exclusion",
  BLC_SAMEPAGE: "Same-page URL Exclusion",
  BLC_SCHEME: "Scheme Exclusion",
  BLC_UNKNOWN: "Unknown Error",
  ERRNO_ENOTFOUND: "no matching dns record (ENOTFOUND)",
  // @todo https://github.com/tc39/proposal-pipeline-operator
  ...Object.fromEntries(Object.entries(_errno.code).map(([key, {
    description
  }]) => [`ERRNO_${key}`, `${description} (${key})`])),
  // @todo https://github.com/tc39/proposal-pipeline-operator
  ...Object.fromEntries(Object.entries(_http.STATUS_CODES).map(([key, value]) => [`HTTP_${key}`, `${value} (${key})`]))
});

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=reasons.js.map