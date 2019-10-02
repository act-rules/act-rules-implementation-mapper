const fs = require("fs");
const globby = require("globby");
const assert = require("assert");
const isUrl = require("is-url");
const axios = require("axios");

/**
 * Load json report(s) from given path, url or glob
 * @method jsonLoader
 * @param {String|String[]} path file path, or glob or url to jsonld/earl report
 * @returns {Object[]}
 */
async function jsonLoader(path) {
  assert(path, "`path` argument is required.");

  if (isUrl(path)) {
    const { data } = await axios.get(path);
    return data;
  }

  const reports = globby.sync(path).map(reportPath => {
    const fileContent = fs.readFileSync(reportPath, { encoding: "utf-8" });
    return JSON.parse(fileContent);
  });

  return reports;
}

module.exports = jsonLoader;
