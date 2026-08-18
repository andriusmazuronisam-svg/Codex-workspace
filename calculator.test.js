const test = require("node:test");
const assert = require("node:assert/strict");
const { calculate, formatNumber } = require("./calculator.js");

test("supports the four arithmetic operations", () => {
  assert.equal(calculate(8, 2, "add"), 10);
  assert.equal(calculate(8, 2, "subtract"), 6);
  assert.equal(calculate(8, 2, "multiply"), 16);
  assert.equal(calculate(8, 2, "divide"), 4);
});

test("handles division by zero", () => {
  assert.equal(calculate(8, 0, "divide"), null);
});

test("formats floating point results cleanly", () => {
  assert.equal(formatNumber(0.1 + 0.2), "0.3");
});

test("rejects unknown operations", () => {
  assert.throws(() => calculate(1, 2, "power"), /Unknown operation/);
});
