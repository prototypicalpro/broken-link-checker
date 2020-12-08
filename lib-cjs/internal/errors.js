"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLRetrievalError = exports.ExpectedHTMLError = void 0;

class ExpectedHTMLError extends TypeError {
  /**
   * @param {string} mimeType
   * @param {number|string} statusCode
   */
  constructor(mimeType = "", statusCode) {
    if (mimeType !== "") {
      mimeType = ` but got "${mimeType}"`;
    }

    super(`Expected type "text/html"${mimeType}`);
    this.code = statusCode;
  }

}

exports.ExpectedHTMLError = ExpectedHTMLError;

class HTMLRetrievalError extends Error {
  /**
   * @param {number|string} statusCode
   */
  constructor(statusCode) {
    super("HTML could not be retrieved");
    this.code = statusCode;
  }

}

exports.HTMLRetrievalError = HTMLRetrievalError;
//# sourceMappingURL=errors.js.map