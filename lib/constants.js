import { getInput } from '@actions/core';
import { isNullOrUndefined } from './util.js';
/**
 * Gets the action configuration.
 */
export const action = {
    token: getInput('token'),
    template: !isNullOrUndefined(getInput('template'))
        ? getInput('template')
        : `<a href="https://github.com/{{ login }}"><img src="{{ avatarUrl }}" width="60px" alt="User avatar: {{ name }}" /></a>`,
    minimum: !isNullOrUndefined(getInput('minimum'))
        ? parseInt(getInput('minimum'))
        : 0,
    maximum: !isNullOrUndefined(getInput('maximum'))
        ? parseInt(getInput('maximum'))
        : 0,
    marker: !isNullOrUndefined(getInput('marker'))
        ? getInput('marker')
        : 'sponsors',
    file: !isNullOrUndefined(getInput('file')) ? getInput('file') : 'README.md',
    fallback: !isNullOrUndefined(getInput('fallback'))
        ? getInput('fallback')
        : ``,
    organization: !isNullOrUndefined(getInput('organization'))
        ? getInput('organization').toLowerCase() === 'true'
        : false,
    activeOnly: !isNullOrUndefined(getInput('active-only'))
        ? getInput('active-only').toLowerCase() === 'true'
        : false,
    includePrivate: !isNullOrUndefined(getInput('include-private'))
        ? getInput('include-private').toLowerCase() === 'true'
        : false
};
/**
 * Privacy levels for the sponsorship.
 */
export var PrivacyLevel;
(function (PrivacyLevel) {
    PrivacyLevel["PUBLIC"] = "PUBLIC";
    PrivacyLevel["PRIVATE"] = "PRIVATE";
})(PrivacyLevel || (PrivacyLevel = {}));
/**
 * Statuses for the action.
 */
export var Status;
(function (Status) {
    Status["SUCCESS"] = "success";
    Status["FAILED"] = "failed";
    Status["RUNNING"] = "running";
    Status["SKIPPED"] = "skipped";
})(Status || (Status = {}));
/**
 * URLs used within the action.
 */
export var Urls;
(function (Urls) {
    Urls["GITHUB_API"] = "https://api.github.com";
})(Urls || (Urls = {}));
