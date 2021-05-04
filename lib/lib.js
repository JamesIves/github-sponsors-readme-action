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
exports.getSponsors = exports.generateFile = void 0;
const core_1 = require("@actions/core");
const constants_1 = require("./constants");
const template_1 = require("./template");
Object.defineProperty(exports, "generateFile", { enumerable: true, get: function () { return template_1.generateFile; } });
Object.defineProperty(exports, "getSponsors", { enumerable: true, get: function () { return template_1.getSponsors; } });
const util_1 = require("./util");
/** Initializes and runs the action.
 *
 * @param {ActionInterface} configuration - The configuration object.
 */
function run(configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        let status = constants_1.Status.RUNNING;
        const settings = Object.assign({}, configuration);
        try {
            core_1.info(`
    GitHub Sponsors Readme Action 💖

    🚀 Getting Started Guide: https://github.com/JamesIves/github-sponsors-readme-action
    ❓ Discussions / Q&A: https://github.com/JamesIves/github-sponsors-readme-action/discussions
    🔧 Report a Bug: https://github.com/JamesIves/github-sponsors-readme-action/issues

    📣 Maintained by James Ives: https://jamesiv.es
    💖 Support: https://github.com/sponsors/JamesIves`);
            core_1.info('Checking configuration and initializing… 🚚');
            util_1.checkParameters(settings);
            const response = yield template_1.getSponsors(settings);
            status = yield template_1.generateFile(response, settings);
        }
        catch (error) {
            status = constants_1.Status.FAILED;
            core_1.setFailed(error.message);
        }
        finally {
            core_1.info(`${status === constants_1.Status.FAILED
                ? 'There was an error generating sponsors. ❌'
                : status === constants_1.Status.SUCCESS
                    ? 'The data was succesfully retrieved and saved! ✅ 💖'
                    : `Unable to locate markers in your file. Please check the documentation and try again. ⚠️`}`);
            core_1.setOutput('sponsorship-status', status);
        }
    });
}
exports.default = run;
