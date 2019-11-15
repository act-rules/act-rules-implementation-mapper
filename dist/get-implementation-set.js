"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const get_implementation_id_1 = require("./utils/get-implementation-id");
const get_implementation_1 = require("./get-implementation");
const is_consistent_implementation_set_1 = require("./utils/is-consistent-implementation-set");
const sort_implementations_1 = require("./utils/sort-implementations");
function getImplementationSet(assertions, testcases) {
    // Group asserts by implementation ID
    const assertsByImplementationId = assertions.reduce((assertsByRule, assertion) => {
        // Normalise around a bug in WCAG-EM
        const test = assertion.test || assertion['wcagem-test'];
        if (!test) {
            debug_1.default('getImplementationSet')(`Skipped! Could not find 'test' in assertion ${JSON.stringify(assertion)}`);
            return assertsByRule;
        }
        const implementationId = get_implementation_id_1.implementationIdFromTest(test);
        if (!assertsByRule[implementationId]) {
            assertsByRule[implementationId] = [];
        }
        assertsByRule[implementationId].push(assertion);
        return assertsByRule;
    }, {});
    // Get all implementnations, sorted and with their ID added in
    const allImplementations = Object.entries(assertsByImplementationId)
        .map(([implementationId, asssertions]) => (Object.assign({ implementationId }, get_implementation_1.getImplementation(testcases, asssertions))))
        .sort(sort_implementations_1.sortImplementations);
    // Figure out what implementations make for what consistency
    const { implementations, consistency } = findConsistency(allImplementations);
    const complete = implementations.every(({ complete }) => complete);
    return { complete, consistency, implementations };
}
exports.getImplementationSet = getImplementationSet;
function findConsistency(implementations) {
    const consistentImpl = implementations.filter(({ consistency }) => consistency === 'consistent');
    if (consistentImpl.length > 0) {
        return {
            consistency: 'consistent',
            implementations: consistentImpl,
        };
    }
    const partialImpl = implementations.filter(({ consistency }) => consistency === 'partially-consistent');
    if (partialImpl.length > 0) {
        const consistency = is_consistent_implementation_set_1.isConsistentImplementationSet(partialImpl) ? 'consistent' : 'partially-consistent';
        return {
            consistency,
            implementations: partialImpl,
        };
    }
    return {
        consistency: 'inconsistent',
        implementations,
    };
}
//# sourceMappingURL=get-implementation-set.js.map