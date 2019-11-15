"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const find_assertions_1 = require("./earl/find-assertions");
const get_implementation_set_1 = require("./get-implementation-set");
const get_rule_id_1 = require("./utils/get-rule-id");
var load_json_1 = require("./load-json");
exports.loadJson = load_json_1.loadJson;
async function actMapGenerator(jsonld, { testcases }, meta = {}) {
    const assertions = await find_assertions_1.findAssertions(jsonld);
    const assertsByRule = groupAssertionsByRule(assertions);
    // Get an implementationSet for each rule
    const actMapping = Object.entries(assertsByRule)
        .map(([ruleId, ruleAssertions]) => {
        const ruleTestCases = testcases.filter(testcase => testcase.ruleId === ruleId);
        if (ruleTestCases.length === 0) {
            throw new Error(`Unable to find testcases for rule ${ruleId}`);
        }
        return Object.assign({ ruleId, ruleName: ruleTestCases[0].ruleName }, get_implementation_set_1.getImplementationSet(ruleAssertions, ruleTestCases));
    })
        .sort(implementationSetSort);
    return Object.assign(Object.assign({}, meta), { summary: {
            consistent: countPropMatch(actMapping, 'consistency', 'consistent'),
            partiallyConsistent: countPropMatch(actMapping, 'consistency', 'partially-consistent'),
            inconsistent: countPropMatch(actMapping, 'consistency', 'inconsistent'),
            incomplete: countPropMatch(actMapping, 'complete', false),
        }, actMapping });
}
exports.actMapGenerator = actMapGenerator;
function groupAssertionsByRule(assertions) {
    const assertsByRule = {};
    assertions.forEach(assertion => {
        const ruleId = assertion.subject && get_rule_id_1.ruleIdFromSubject(assertion.subject);
        if (!ruleId) {
            debug_1.default('actMapper')(`Skipped! Could not find 'ruleId' in subject of assertion ${JSON.stringify(assertion)}`);
            return;
        }
        if (!assertsByRule[ruleId]) {
            assertsByRule[ruleId] = [];
        }
        assertsByRule[ruleId].push(assertion);
    });
    return assertsByRule;
}
const consistencyWeight = ['inconsistent', 'partially-consistent', 'consistent'];
function implementationSetSort(setA, setB) {
    const weightA = consistencyWeight.indexOf(setA.consistency);
    const weightB = consistencyWeight.indexOf(setB.consistency);
    if (weightA !== weightB) {
        return weightB - weightA;
    }
    if (setA.complete !== setB.complete) {
        return Number(setA.complete) - Number(setB.complete);
    }
    return 0;
}
function countPropMatch(actMapping, prop, value) {
    return actMapping.reduce((count, set) => {
        return count + Number(set[prop] === value);
    }, 0);
}
//# sourceMappingURL=act-map-generator.js.map