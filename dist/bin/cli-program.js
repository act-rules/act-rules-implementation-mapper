"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const act_map_generator_1 = require("../act-map-generator");
const flat_map_1 = require("../utils/flat-map");
const load_json_1 = require("../load-json");
const debug_1 = __importDefault(require("debug"));
const writeFile = util_1.promisify(fs_1.default.writeFile);
async function cliProgram({ organisation, toolName, jsonReports, testcases, output, toolVersion }, log) {
    output = output.replace('{organisation}', organisation || '{organisation}').replace('{tool}', toolName || '{tool}');
    const outputPath = path_1.default.resolve(process.cwd(), output);
    const meta = { organisation, toolName, toolVersion };
    // Load all the JSON files
    const jsonldFiles = flat_map_1.flatMap(await Promise.all(jsonReports.map(report => {
        try {
            return load_json_1.loadJson(report);
        }
        catch (error) {
            debug_1.default('loadJson')(`Unable to load '${report}', received error:\n${error}`);
            return null;
        }
    }))).filter(report => report);
    const [testcaseFile] = (await load_json_1.loadJson(testcases));
    log('Loading files');
    const implementationMapping = await act_map_generator_1.actMapGenerator(jsonldFiles, testcaseFile, meta);
    const fileContent = JSON.stringify(implementationMapping, null, 2);
    // Save the report
    log(`Saved report to ${outputPath}`);
    await writeFile(outputPath, fileContent);
}
exports.cliProgram = cliProgram;
//# sourceMappingURL=cli-program.js.map