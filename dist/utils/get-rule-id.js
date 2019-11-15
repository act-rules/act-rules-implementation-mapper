"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_source_1 = require("./get-source");
function ruleIdFromSubject(subject) {
    const source = get_source_1.sourceFromSubject(subject);
    if (source) {
        return ruleIdFromUri(source);
    }
}
exports.ruleIdFromSubject = ruleIdFromSubject;
function ruleIdFromUri(url) {
    const match = url.match(/\/([a-z0-9]{6})\/([a-z0-9]{40})\.[a-z]{3,4}/);
    if (!match) {
        throw new Error(`Unable to find rule ID in ${url}`);
    }
    return match[1];
}
exports.ruleIdFromUri = ruleIdFromUri;
//# sourceMappingURL=get-rule-id.js.map