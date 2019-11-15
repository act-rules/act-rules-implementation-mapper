"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const globby_1 = __importDefault(require("globby"));
const debug_1 = __importDefault(require("debug"));
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const readFile = util_1.promisify(fs_1.default.readFile);
async function loadJson(filePath) {
    if (/^https?:\/\//.test(filePath)) {
        debug_1.default('load:request')(`fetching ${filePath}`);
        const data = await request_promise_1.default({ uri: filePath, json: true });
        return [data];
    }
    else {
        const filePaths = await globby_1.default(filePath);
        const sources = await Promise.all(filePaths.map((filePath) => {
            debug_1.default('load:readFile')(`Loading ${filePath}`);
            return readFile(filePath, 'utf8');
        }));
        return sources.map(source => JSON.parse(source));
    }
}
exports.loadJson = loadJson;
//# sourceMappingURL=load-json.js.map