"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSponsors = getSponsors;
exports.generateTemplate = generateTemplate;
exports.generateFile = generateFile;
const fs_1 = require("fs");
const constants_1 = require("./constants");
const mustache_1 = require("mustache");
const util_1 = require("./util");
const core_1 = require("@actions/core");
/**
 * Fetches sponsors from the GitHub Sponsors API.
 */
function getSponsors(action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, core_1.info)(`Fetching data from the GitHub API as ${action.organization ? 'Organization' : 'User'}… ⚽`);
            const query = `query { 
      ${action.organization
                ? `organization (login: "${process.env.GITHUB_REPOSITORY_OWNER}")`
                : `viewer`} {
        login
        sponsorshipsAsMaintainer(first: 100, orderBy: {field: CREATED_AT, direction: ASC}, includePrivate: ${action.includePrivate}, activeOnly: ${action.activeOnly}) {
          totalCount
          pageInfo {
            endCursor
          }
          nodes {
            sponsorEntity {
              ... on Organization {
                name
                login
                url
                websiteUrl
              }
              ... on User {
                name
                login
                url
                websiteUrl
              }
            }
            createdAt
            privacyLevel
            tier {
              monthlyPriceInCents
            }
          }
        }
      }
    }`;
            const data = yield fetch(`${constants_1.Urls.GITHUB_API}/graphql`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${action.token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    query
                })
            });
            return data.json();
        }
        catch (error) {
            throw new Error(`There was an error with the GitHub API request: ${(0, util_1.suppressSensitiveInformation)((0, util_1.extractErrorMessage)(error), action)} ❌`);
        }
    });
}
/**
 * Generates the sponsorship template.
 */
function generateTemplate(response, action) {
    var _a, _b, _c, _d;
    let template = ``;
    (0, core_1.info)('Generating template… ✨');
    /**
     * Determines if the response is from an organization or a user.
     * Performs checks to see if the data is available before we
     * reference it as the API results can be somewhat sporadic.
     */
    const data = action.organization && ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.organization)
        ? (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.organization
        : ((_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.viewer)
            ? (_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.viewer
            : null;
    const sponsorshipsAsMaintainer = data === null || data === void 0 ? void 0 : data.sponsorshipsAsMaintainer;
    if (sponsorshipsAsMaintainer) {
        let filteredSponsors = sponsorshipsAsMaintainer.nodes.filter((user) => (user.tier && user.tier.monthlyPriceInCents
            ? user.tier.monthlyPriceInCents
            : 0) >= action.minimum);
        /**
         * If `includePrivate` is true here, we replace the private sponsors with a placeholder asset and anonymize all data to respect privacy.
         */
        if (action.includePrivate) {
            filteredSponsors = filteredSponsors.map((user) => {
                if (user.privacyLevel === constants_1.PrivacyLevel.PRIVATE) {
                    return Object.assign(Object.assign({}, user), { sponsorEntity: {
                            name: 'Private Sponsor',
                            login: '',
                            url: 'https://github.com',
                            websiteUrl: 'https://github.com',
                            avatarUrl: 'https://raw.githubusercontent.com/JamesIves/github-sponsors-readme-action/dev/.github/assets/placeholder.png'
                        } });
                }
                return user;
            });
        }
        else {
            /**
             * If `includePrivate` is false we filter out any priv1ate sponsors. This is a safeguard incase the GitHub API
             * decides to return private sponsors for some reason.
             */
            filteredSponsors = filteredSponsors.filter((user) => user.privacyLevel !== constants_1.PrivacyLevel.PRIVATE);
        }
        if (action.maximum > 0) {
            filteredSponsors = filteredSponsors.filter((user) => (user.tier && user.tier.monthlyPriceInCents
                ? user.tier.monthlyPriceInCents
                : 0) <= action.maximum);
        }
        (0, core_1.info)(`Found ${filteredSponsors.length} matching ${filteredSponsors.length === 1 ? 'sponsor' : 'sponsors'}… ${filteredSponsors.length > 0 ? '🎉' : '😢'}`);
        /**
         * If there are no valid sponsors then we return the provided fallback.
         */
        if (!filteredSponsors.length) {
            return action.fallback;
        }
        filteredSponsors.map(({ sponsorEntity }) => {
            /**
             * Sanitizes and cleans the sponsor data individually.
             */
            const sanitizedSponsorEntity = {
                websiteUrl: (0, util_1.sanitizeAndClean)(sponsorEntity.websiteUrl || sponsorEntity.url),
                name: (0, util_1.sanitizeAndClean)(sponsorEntity.name || ''),
                login: (0, util_1.sanitizeAndClean)(sponsorEntity.login),
                /**
                 * The avatar URL provided by the GitHub API includes an expiration token so we circumvent this for now
                 * by using a path that is always available.
                 */
                avatarUrl: sponsorEntity.avatarUrl
                    ? sponsorEntity.avatarUrl
                    : `https://github.com/${(0, util_1.sanitizeAndClean)(sponsorEntity.login)}.png`
            };
            /**
             * Ensure that the template is safe to render by preventing the usage of triple brackets.
             */
            const safeTemplate = (0, util_1.replaceAll)((0, util_1.replaceAll)(action.template, '{{{', '{{'), '}}}', '}}');
            template = template += (0, mustache_1.render)(safeTemplate, sanitizedSponsorEntity);
        });
    }
    else {
        (0, core_1.info)(`No sponsorship data was found… ❌`);
        return action.fallback;
    }
    return template;
}
/**
 * Generates the updated file with the attached sponsorship template.
 */
function generateFile(response, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, core_1.info)(`Generating updated ${action.file} file… 📁`);
            /** Replaces the content within the comments and re appends/prepends the comments to the replace for follow-up workflow runs. */
            const regex = new RegExp(`(<!-- ${action.marker} -->)[\\s\\S]*?(<!-- ${action.marker} -->)`, 'g');
            let data = yield fs_1.promises.readFile(action.file, 'utf8');
            if (!regex.test(data)) {
                return constants_1.Status.SKIPPED;
            }
            data = data.replace(regex, `$1${generateTemplate(response, action)}$2`);
            yield fs_1.promises.writeFile(action.file, data);
            return constants_1.Status.SUCCESS;
        }
        catch (error) {
            throw new Error(`There was an error generating the updated file: ${(0, util_1.suppressSensitiveInformation)((0, util_1.extractErrorMessage)(error), action)} ❌`);
        }
    });
}
