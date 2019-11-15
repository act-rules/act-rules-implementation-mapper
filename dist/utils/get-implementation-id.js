"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function implementationIdFromTest(testCriterion) {
    if (typeof testCriterion === 'string') {
        return testCriterion;
    }
    if (typeof testCriterion !== 'object') {
        throw new TypeError(`Assertion.test must be a TestCriterion or string, got '${JSON.stringify(testCriterion)}'`);
    }
    if (typeof testCriterion.title === 'string') {
        return testCriterion.title;
    }
    if (typeof testCriterion['@id'] === 'string') {
        return getFileName(testCriterion['@id']);
    }
    throw new Error(`Unable to find implementation ID in '${JSON.stringify(testCriterion)}'`);
}
exports.implementationIdFromTest = implementationIdFromTest;
function getFileName(url) {
    const filename = path_1.default.basename(url) || '';
    if (filename.lastIndexOf('.') === -1) {
        return filename;
    }
    return filename.substr(0, filename.lastIndexOf('.'));
}
exports.getFileName = getFileName;
//# sourceMappingURL=get-implementation-id.js.map