"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Urls = exports.Status = exports.PrivacyLevel = exports.action = void 0;
const core_1 = require("@actions/core");
const util_1 = require("./util");
// Required action data that gets initialized when running within the GitHub Actions environment.
exports.action = {
    token: core_1.getInput('token'),
    template: !util_1.isNullOrUndefined(core_1.getInput('template'))
        ? core_1.getInput('template')
        : `<a href="https://github.com/{{{ login }}}"><img src="https://github.com/{{{ login }}}.png" width="60px" alt="" /></a>`,
    minimum: !util_1.isNullOrUndefined(core_1.getInput('minimum'))
        ? parseInt(core_1.getInput('minimum'))
        : 0,
    maximum: !util_1.isNullOrUndefined(core_1.getInput('maximum'))
        ? parseInt(core_1.getInput('maximum'))
        : 0,
    marker: !util_1.isNullOrUndefined(core_1.getInput('marker'))
        ? core_1.getInput('marker')
        : 'sponsors',
    file: !util_1.isNullOrUndefined(core_1.getInput('file')) ? core_1.getInput('file') : 'README.md',
    fallback: !util_1.isNullOrUndefined(core_1.getInput('fallback'))
        ? core_1.getInput('fallback')
        : ``,
    organization: !util_1.isNullOrUndefined(core_1.getInput('organization'))
        ? core_1.getInput('organization').toLowerCase() === 'true'
        : false
};
var PrivacyLevel;
(function (PrivacyLevel) {
    PrivacyLevel["PUBLIC"] = "PUBLIC";
    PrivacyLevel["PRIVATE"] = "PRIVATE";
})(PrivacyLevel = exports.PrivacyLevel || (exports.PrivacyLevel = {}));
/** Status codes for the action. */
var Status;
(function (Status) {
    Status["SUCCESS"] = "success";
    Status["FAILED"] = "failed";
    Status["RUNNING"] = "running";
    Status["SKIPPED"] = "skipped";
})(Status = exports.Status || (exports.Status = {}));
var Urls;
(function (Urls) {
    Urls["GITHUB_API"] = "https://api.github.com";
})(Urls = exports.Urls || (exports.Urls = {}));
