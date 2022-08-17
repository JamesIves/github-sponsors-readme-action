"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractErrorMessage = exports.suppressSensitiveInformation = exports.checkParameters = exports.isNullOrUndefined = void 0;
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
        throw new Error('No deployment token was provided. You must provide the action with a Personal Access Token scoped to user:read or org:read.');
    }
};
exports.checkParameters = checkParameters;
/**
 * Replaces all instances of a match in a string.
 */
const replaceAll = (input, find, replace) => input.split(find).join(replace);
/**
 * Suppresses sensitive information from being exposed in error messages.
 */
const suppressSensitiveInformation = (str, action) => {
    let value = str;
    const orderedByLength = [action.token, action.token].filter(Boolean).sort((a, b) => b.length - a.length);
    for (const find of orderedByLength) {
        value = replaceAll(value, find, '***');
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
