/**
 * Get testcases of rules
 * - group them by `ruleId`
 *
 * @param {Object} testcases ACT Rules testcases
 */
const getTestcasesGroupedByRule = testcases => {
  return testcases.reduce((out, testcase) => {
    const { ruleId } = testcase;
    if (!out[ruleId]) {
      out[ruleId] = [];
    }
    out[ruleId].push(testcase);
    return out;
  }, {});
};

module.exports = getTestcasesGroupedByRule;
