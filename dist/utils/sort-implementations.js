"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sortImplementations(implA, implB) {
    const findingsA = implA.findings;
    const findingsB = implB.findings;
    // sort by no meaningful results
    const notMeaningfulA = findingsA.every(({ actual }) => ['untested', 'cantTell'].includes(actual));
    const notMeaningfulB = findingsB.every(({ actual }) => ['untested', 'cantTell'].includes(actual));
    if (notMeaningfulA !== notMeaningfulB) {
        return Number(notMeaningfulA) - Number(notMeaningfulB);
    }
    // Sort by number of inconsistencies
    const inconsistenciesA = findingsA.reduce(inconsistencyCount, 0);
    const inconsistenciesB = findingsB.reduce(inconsistencyCount, 0);
    if (inconsistenciesA !== inconsistenciesB) {
        return inconsistenciesA - inconsistenciesB;
    }
    // Sort by number of partial hits
    const partialsA = findingsA.reduce(partialCount, 0);
    const partialsB = findingsB.reduce(partialCount, 0);
    if (partialsA !== partialsB) {
        return partialsA - partialsB;
    }
    // sort by number of untested
    const untestedA = findingsA.reduce(resultTypeCount('untested'), 0);
    const untestedB = findingsB.reduce(resultTypeCount('untested'), 0);
    if (untestedA !== untestedB) {
        return untestedA - untestedB;
    }
    // sort by number of cantTells
    const cantTellA = findingsA.reduce(resultTypeCount('cantTell'), 0);
    const cantTellB = findingsB.reduce(resultTypeCount('cantTell'), 0);
    if (cantTellA !== cantTellB) {
        return cantTellA - cantTellB;
    }
    return 0;
}
exports.sortImplementations = sortImplementations;
function inconsistencyCount(count = 0, { expected, actual }) {
    return count + Number(expected !== 'failed' && actual === 'failed');
}
function partialCount(count = 0, { expected, actual }) {
    return count + Number(expected === 'failed' && !['failed', 'cantTell', 'untested'].includes(actual));
}
function resultTypeCount(type) {
    return function resultCount(count = 0, { actual }) {
        return count + Number(actual === type);
    };
}
//# sourceMappingURL=sort-implementations.js.map