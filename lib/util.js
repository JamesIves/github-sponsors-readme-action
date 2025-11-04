"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeAndClean = exports.extractErrorMessage = exports.suppressSensitiveInformation = exports.replaceAll = exports.checkParameters = exports.isNullOrUndefined = void 0;
const jsdom_1 = require("jsdom");
const dompurify_1 = __importDefault(require("dompurify"));
/**
 * Defines the a new virtual DOM.
 */
const { window } = new jsdom_1.JSDOM('');
/**
 * Sanitizes the input.
 */
const { sanitize } = (0, dompurify_1.default)(window);
/**
 * Utility function that checks to see if a value is undefined or not.
 */
const isNullOrUndefined = (value) => typeof value === 'undefined' || value === null || value === '';
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Checks for the required tokens and formatting. Throws an error if any case is matched.
 */
const hasRequiredParameters = (action, params) => {
    const nonNullParams = params.filter(param => !(0, exports.isNullOrUndefined)(action[param]));
    return Boolean(nonNullParams.length);
};
/**
 * Verifies the action has the required parameters to run, otherwise throw an error.
 */
const checkParameters = (action) => {
    if (!hasRequiredParameters(action, ['token'])) {
        throw new Error('No deployment token was provided. You must provide the action with a Personal Access Token scoped to user:read and org:read.');
    }
};
exports.checkParameters = checkParameters;
/**
 * Replaces all instances of a match in a string.
 */
const replaceAll = (input, find, replace) => input.split(find).join(replace);
exports.replaceAll = replaceAll;
/**
 * Suppresses sensitive information from being exposed in error messages.
 */
const suppressSensitiveInformation = (str, action) => {
    let value = str;
    const orderedByLength = [action.token, action.token].filter(Boolean).sort((a, b) => b.length - a.length);
    for (const find of orderedByLength) {
        value = (0, exports.replaceAll)(value, find, '***');
    }
    return value;
};
exports.suppressSensitiveInformation = suppressSensitiveInformation;
/**
 * Extracts error message from an error.
 */
const extractErrorMessage = (error) => error instanceof Error
    ? error.message
    : typeof error == 'string'
        ? error
        : JSON.stringify(error);
exports.extractErrorMessage = extractErrorMessage;
/**
 * Sanitizes and cleans an input.
 */
const sanitizeAndClean = (input) => {
    const sanitizedInput = sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
    return sanitizedInput.replace(/["'<>]/g, '');
};
exports.sanitizeAndClean = sanitizeAndClean;
