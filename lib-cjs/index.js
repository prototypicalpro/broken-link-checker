"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  reasons: true,
  DEFAULT_OPTIONS: true,
  HtmlChecker: true,
  HtmlUrlChecker: true,
  SiteChecker: true,
  UrlChecker: true
};
Object.defineProperty(exports, "DEFAULT_OPTIONS", {
  enumerable: true,
  get: function () {
    return _defaultOptions.default;
  }
});
Object.defineProperty(exports, "HtmlChecker", {
  enumerable: true,
  get: function () {
    return _HtmlChecker.default;
  }
});
Object.defineProperty(exports, "HtmlUrlChecker", {
  enumerable: true,
  get: function () {
    return _HtmlUrlChecker.default;
  }
});
Object.defineProperty(exports, "SiteChecker", {
  enumerable: true,
  get: function () {
    return _SiteChecker.default;
  }
});
Object.defineProperty(exports, "UrlChecker", {
  enumerable: true,
  get: function () {
    return _UrlChecker.default;
  }
});
exports.reasons = void 0;

var _events = require("./internal/events");

Object.keys(_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _events[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _events[key];
    }
  });
});

var _methods = require("./internal/methods");

Object.keys(_methods).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _methods[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _methods[key];
    }
  });
});

var _reasons = _interopRequireWildcard(require("./internal/reasons"));

exports.reasons = _reasons;

var _defaultOptions = _interopRequireDefault(require("./internal/defaultOptions"));

var _HtmlChecker = _interopRequireDefault(require("./public/HtmlChecker"));

var _HtmlUrlChecker = _interopRequireDefault(require("./public/HtmlUrlChecker"));

var _SiteChecker = _interopRequireDefault(require("./public/SiteChecker"));

var _UrlChecker = _interopRequireDefault(require("./public/UrlChecker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//# sourceMappingURL=index.js.map