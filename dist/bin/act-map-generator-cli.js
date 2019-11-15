#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_program_1 = require("./cli-program");
const yargs_1 = __importDefault(require("yargs"));
// @ts-ignore
const { argv } = yargs_1.default
    .usage('Usage: $0 --jsonReports ./reports/**.json [options]')
    .option('jsonReports', {
    alias: 'j',
    describe: 'Implementation report',
    demand: true,
    array: true,
})
    .option('testcases', {
    alias: 't',
    describe: 'ACT Rules testcases',
    default: 'https://act-rules.github.io/testcases.json',
})
    .option('output', {
    alias: 'o',
    describe: 'Output directory for mapped results',
    default: './{tool}-mapping.json',
})
    .option('organisation', {
    alias: 'O',
    describe: 'Organisation, submitting the implementation report',
})
    .option('toolName', {
    alias: 'T',
    describe: 'Tool which was used to generate the implementation report',
    default: 'unknown',
})
    .option('toolVersion', {
    alias: 'V',
    describe: 'Version of the tool',
})
    .help()
    .version();
cli_program_1.cliProgram(argv, console.log.bind(console)).catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=act-map-generator-cli.js.map