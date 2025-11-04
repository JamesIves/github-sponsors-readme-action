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
exports.default = run;
const core_1 = require("@actions/core");
const constants_1 = require("./constants");
const template_1 = require("./template");
Object.defineProperty(exports, "generateFile", { enumerable: true, get: function () { return template_1.generateFile; } });
Object.defineProperty(exports, "getSponsors", { enumerable: true, get: function () { return template_1.getSponsors; } });
const util_1 = require("./util");
/**
 * Initializes and runs the action.
 * If no configuration is provided, the action will run with the default configuration.
 */
function run(configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        let status = constants_1.Status.RUNNING;
        /**
         * Merges the action configuration with the user configuration.
         */
        const settings = Object.assign(Object.assign({}, constants_1.action), configuration);
        try {
            (0, core_1.info)(`

     ██████╗ ██╗████████╗██╗  ██╗██╗   ██╗██████╗                       
    ██╔════╝ ██║╚══██╔══╝██║  ██║██║   ██║██╔══██╗                      
    ██║  ███╗██║   ██║   ███████║██║   ██║██████╔╝                      
    ██║   ██║██║   ██║   ██╔══██║██║   ██║██╔══██╗                      
    ╚██████╔╝██║   ██║   ██║  ██║╚██████╔╝██████╔╝                      
     ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝                       
                                                                        
    ███████╗██████╗  ██████╗ ███╗   ██╗███████╗ ██████╗ ██████╗ ███████╗
    ██╔════╝██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔═══██╗██╔══██╗██╔════╝
    ███████╗██████╔╝██║   ██║██╔██╗ ██║███████╗██║   ██║██████╔╝███████╗
    ╚════██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║██║   ██║██╔══██╗╚════██║
    ███████║██║     ╚██████╔╝██║ ╚████║███████║╚██████╔╝██║  ██║███████║
    ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                                                                        
    ██████╗ ███████╗ █████╗ ██████╗ ███╗   ███╗███████╗                 
    ██╔══██╗██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝                 
    ██████╔╝█████╗  ███████║██║  ██║██╔████╔██║█████╗                   
    ██╔══██╗██╔══╝  ██╔══██║██║  ██║██║╚██╔╝██║██╔══╝                   
    ██║  ██║███████╗██║  ██║██████╔╝██║ ╚═╝ ██║███████╗                 
    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝                 
                                                                        
     █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗                     
    ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║                     
    ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║                     
    ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║                     
    ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║                     
    ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝                     
                                                                        
    🚀 Getting Started Guide: https://github.com/JamesIves/github-sponsors-readme-action
    ❓ Discussions / Q&A: https://github.com/JamesIves/github-sponsors-readme-action/discussions
    🔧 Report a Bug: https://github.com/JamesIves/github-sponsors-readme-action/issues

    📣 Maintained by James Ives: https://jamesiv.es
    💖 Support: https://github.com/sponsors/JamesIves`);
            (0, core_1.info)('Checking configuration and initializing… 🚚');
            (0, util_1.checkParameters)(settings);
            const response = yield (0, template_1.getSponsors)(settings);
            status = yield (0, template_1.generateFile)(response, settings);
        }
        catch (error) {
            status = constants_1.Status.FAILED;
            (0, core_1.setFailed)((0, util_1.extractErrorMessage)(error));
        }
        finally {
            (0, core_1.info)(`${status === constants_1.Status.FAILED
                ? 'There was an error generating sponsors. ❌'
                : status === constants_1.Status.SUCCESS
                    ? 'The data was successfully retrieved and saved! ✅ 💖'
                    : `Unable to locate markers in your file, ensure you have a starting and closing tag in your README file. Please check the documentation and try again. ⚠️`}`);
            (0, core_1.exportVariable)('sponsorshipStatus', status);
            (0, core_1.setOutput)('sponsorshipStatus', status);
        }
        return status;
    });
}
