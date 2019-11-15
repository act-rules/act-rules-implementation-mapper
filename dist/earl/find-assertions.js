"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_1 = require("jsonld");
const earlContext = __importStar(require("./earl-context.json"));
const debug_1 = __importDefault(require("debug"));
const assertionFrame = Object.assign(Object.assign({}, earlContext), { '@type': 'earl:Assertion' });
async function findAssertions(jsonReports) {
    if (typeof jsonReports !== 'object') {
        throw new TypeError(`JSON report must be an object or array, got '${jsonReports}'`);
    }
    const reports = Array.isArray(jsonReports) ? jsonReports : [jsonReports];
    const framedReports = [];
    for (const report of reports) {
        try {
            const framedReport = (await jsonld_1.frame(report, assertionFrame));
            framedReports.push(framedReport);
        }
        catch (e) {
            debug_1.default('findAssertions')(`Unable to frame JSON file. Got error:\n${e}`);
        }
    }
    /**
     * Extrapolate `@graph` object from each report
     */
    return framedReports.reduce((assertions, framedReports) => {
        const newAssertions = framedReports[`@graph`];
        return assertions.concat(newAssertions);
    }, []);
}
exports.findAssertions = findAssertions;
//# sourceMappingURL=find-assertions.js.map