"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Urls = exports.Status = exports.PrivacyLevel = exports.action = void 0;
const core_1 = require("@actions/core");
const util_1 = require("./util");
/**
 * Gets the action configuration.
 */
exports.action = {
    token: (0, core_1.getInput)('token'),
    template: !(0, util_1.isNullOrUndefined)((0, core_1.getInput)('template'))
        ? (0, core_1.getInput)('template')
        : `<a href="https://github.com/{{ login }}"><img src="https://github.com/{{ login }}.png" width="60px" alt="{{ name }}" /></a>`,
    minimum: !(0, util_1.isNullOrUndefined)((0, core_1.getInput)('minimum'))
        ? parseInt((0, core_1.getInput)('minimum'))
        : 0,
    maximum: !(0, util_1.isNullOrUndefined)((0, core_1.getInput)('maximum'))
        ? parseInt((0, core_1.getInput)('maximum'))
        : 0,
    marker: !(0, util_1.isNullOrUndefined)((0, core_1.getInput)('marker'))
        ? (0, core_1.getInput)('marker')
        : 'sponsors',
    file: !(0, util_1.isNullOrUndefined)((0, core_1.getInput)('file')) ? (0, core_1.getInput)('file') : 'README.md',
    fallback: !(0, util_1.isNullOrUndefined)((0, core_1.getInput)('fallback'))
        ? (0, core_1.getInput)('fallback')
        : ``,
    organization: !(0, util_1.isNullOrUndefined)((0, core_1.getInput)('organization'))
        ? (0, core_1.getInput)('organization').toLowerCase() === 'true'
        : false,
    activeOnly: !(0, util_1.isNullOrUndefined)((0, core_1.getInput)('active-only'))
        ? (0, core_1.getInput)('active-only').toLowerCase() === 'true'
        : false
};
/**
 * Privacy levels for the sponsorship.
 */
var PrivacyLevel;
(function (PrivacyLevel) {
    PrivacyLevel["PUBLIC"] = "PUBLIC";
    PrivacyLevel["PRIVATE"] = "PRIVATE";
})(PrivacyLevel || (exports.PrivacyLevel = PrivacyLevel = {}));
/**
 * Statuses for the action.
 */
var Status;
(function (Status) {
    Status["SUCCESS"] = "success";
    Status["FAILED"] = "failed";
    Status["RUNNING"] = "running";
    Status["SKIPPED"] = "skipped";
})(Status || (exports.Status = Status = {}));
/**
 * URLs used within the action.
 */
var Urls;
(function (Urls) {
    Urls["GITHUB_API"] = "https://api.github.com";
})(Urls || (exports.Urls = Urls = {}));
