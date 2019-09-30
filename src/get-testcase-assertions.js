const getAssertionSource = require("./get-assertion-source");

/**
 * Get all assertions for given testcase
 *
 * @param {Array<Object>} assertions assertions
 * @param {String} relativeUrl relative url of testcase
 */
const getTestcaseAssertions = (assertions, relativeUrl, actRulesPkgJson) => {
  const testcaseAssertions = assertions.filter(assertion => {
    const source = getAssertionSource(assertion, actRulesPkgJson);
    if (!source) {
      return false;
    }
    return source.includes(relativeUrl);
  });
  return testcaseAssertions;
};

module.exports = getTestcaseAssertions;
