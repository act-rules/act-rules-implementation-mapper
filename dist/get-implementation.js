"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_source_1 = require("./utils/get-source");
const debug_1 = __importDefault(require("debug"));
const outcomeMapping = {
    passed: ['passed', 'inapplicable', 'cantTell'],
    inapplicable: ['passed', 'inapplicable', 'cantTell'],
    failed: ['failed', 'cantTell'],
};
function getImplementation(testcases, assertions) {
    let complete = true;
    const untested = {
        passed: true,
        inapplicable: true,
        failed: true,
    };
    let noTestResults = true;
    let noFailMatches = true;
    let consistency = 'consistent';
    const findings = testcases.map(({ url, expected, testcaseTitle }) => {
        const testcase = testcaseTitle;
        const assertion = assertions.find(a => sameSource(a, url));
        if (!assertion) {
            debug_1.default('getImplementation:assertion')(`Could not find assertion for ${url}`);
        }
        const outcome = getOutcome(assertion);
        if (assertion && outcome === undefined) {
            debug_1.default('getImplementation:outcome')(`Could not find outcome, assuming 'untested' for assertion ${JSON.stringify(assertion)}`);
        }
        const actual = outcome || 'untested';
        let correct = true;
        if (actual === 'untested') {
            // Something is incomplete
            complete = false;
            return { url, testcase, expected, actual, correct: false };
        }
        else {
            // Each type of test case must have at least one outcome that's not untested
            untested[expected] = false;
        }
        // At least one thing must be passed, failed or inapplicable
        if (['passed', 'failed', 'inapplicable'].includes(actual)) {
            noTestResults = false;
        }
        if (!outcomeMapping[expected].includes(actual)) {
            correct = false;
            if (expected === 'failed' && consistency !== 'inconsistent') {
                consistency = 'partially-consistent';
            }
            else if (expected !== 'failed') {
                consistency = 'inconsistent';
            }
        }
        else if (expected === 'failed') {
            noFailMatches = false;
        }
        return { url, testcase, expected, actual, correct };
    });
    if (noTestResults || noFailMatches || untested.passed || untested.failed) {
        consistency = 'inconsistent';
    }
    return { complete, consistency, findings };
}
exports.getImplementation = getImplementation;
function sameSource({ subject }, url) {
    const source = get_source_1.sourceFromSubject(subject);
    if (!source || !/\/([a-z0-9]{6})\/([a-z0-9]{40})\.[a-z]{3,4}/.test(source)) {
        throw new Error(`Assertion on '${source}' is not a test case`);
    }
    // The ending of URL is the same as source
    return url.substr(-source.length) === source;
}
exports.sameSource = sameSource;
function getOutcome(assertion) {
    if (assertion === undefined) {
        return;
    }
    if (typeof assertion.result !== 'object' || typeof assertion.result.outcome !== 'string') {
        throw new TypeError(`Unknown result '${JSON.stringify(assertion.result)}`);
    }
    return assertion.result.outcome.replace('earl:', '');
}
exports.getOutcome = getOutcome;
//# sourceMappingURL=get-implementation.js.map