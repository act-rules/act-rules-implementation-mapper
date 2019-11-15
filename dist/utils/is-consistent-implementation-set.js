"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isConsistentImplementationSet(implementations) {
    if (implementations.length === 0) {
        return false;
    }
    // Assume all implementations have the same URLs.
    //  Something's very wrong if that isn't the case
    const expectedFails = implementations[0].findings.filter(({ expected }) => expected === 'failed');
    return expectedFails.every(({ url }) => {
        return implementations.some(implementation => failedUrl(implementation, url));
    });
}
exports.isConsistentImplementationSet = isConsistentImplementationSet;
function failedUrl({ findings }, url) {
    const finding = findings.find(finding => finding.url === url);
    return finding ? ['failed', 'cantTell'].includes(finding.actual) : false;
}
//# sourceMappingURL=is-consistent-implementation-set.js.map