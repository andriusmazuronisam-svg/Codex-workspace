(function () {
  const symbols = { add: "+", subtract: "−", multiply: "×", divide: "÷" };

  function calculate(left, right, operation) {
    const operations = {
      add: () => left + right,
      subtract: () => left - right,
      multiply: () => left * right,
      divide: () => (right === 0 ? null : left / right),
    };
    if (!operations[operation]) throw new Error("Unknown operation");
    return operations[operation]();
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return "Error";
    const rounded = Number.parseFloat(value.toPrecision(12));
    if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-9)) {
      return rounded.toExponential(6).replace(/\.0+e/, "e");
    }
    return String(rounded);
  }

  if (typeof module !== "undefined" && module.exports) module.exports = { calculate, formatNumber };

  if (typeof document === "undefined") return;

  const display = document.querySelector("#display");
  const expression = document.querySelector("#expression");
  const keypad = document.querySelector(".keypad");
  let current = "0";
  let stored = null;
  let operation = null;
  let replaceCurrent = false;

  function render() {
    display.textContent = current;
    expression.textContent = stored !== null && operation ? `${formatNumber(stored)} ${symbols[operation]}` : "Ready";
    document.querySelectorAll("[data-operation]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.operation === operation);
    });
  }

  function inputNumber(value) {
    if (replaceCurrent) { current = value === "." ? "0." : value; replaceCurrent = false; return render(); }
    if (value === "." && current.includes(".")) return;
    if (current === "0" && value !== ".") current = value;
    else if (current.length < 14) current += value;
    render();
  }

  function chooseOperation(nextOperation) {
    if (operation && !replaceCurrent) evaluate();
    stored = Number(current);
    operation = nextOperation;
    replaceCurrent = true;
    render();
  }

  function evaluate() {
    if (stored === null || !operation) return;
    const left = stored;
    const selectedOperation = operation;
    const right = Number(current);
    const result = calculate(left, right, selectedOperation);
    expression.textContent = `${formatNumber(left)} ${symbols[selectedOperation]} ${formatNumber(right)} =`;
    current = result === null ? "Cannot divide by zero" : formatNumber(result);
    stored = null;
    operation = null;
    replaceCurrent = true;
    display.textContent = current;
    document.querySelectorAll("[data-operation]").forEach((button) => button.classList.remove("is-selected"));
  }

  function clear() { current = "0"; stored = null; operation = null; replaceCurrent = false; render(); }
  function backspace() {
    if (replaceCurrent || current === "Cannot divide by zero") return clear();
    current = current.length > 1 ? current.slice(0, -1) : "0";
    render();
  }

  keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.number) inputNumber(button.dataset.number);
    else if (button.dataset.operation) chooseOperation(button.dataset.operation);
    else if (button.dataset.action === "equals") evaluate();
    else if (button.dataset.action === "clear") clear();
    else if (button.dataset.action === "backspace") backspace();
  });

  const keyboardOperations = { "+": "add", "-": "subtract", "*": "multiply", "/": "divide" };
  document.addEventListener("keydown", (event) => {
    let selector;
    if (/^[0-9.]$/.test(event.key)) { inputNumber(event.key); selector = `[data-number="${event.key}"]`; }
    else if (keyboardOperations[event.key]) { chooseOperation(keyboardOperations[event.key]); selector = `[data-operation="${keyboardOperations[event.key]}"]`; }
    else if (event.key === "Enter" || event.key === "=") { evaluate(); selector = '[data-action="equals"]'; }
    else if (event.key === "Escape") { clear(); selector = '[data-action="clear"]'; }
    else if (event.key === "Backspace") { backspace(); selector = '[data-action="backspace"]'; }
    else return;
    event.preventDefault();
    const button = document.querySelector(selector);
    button?.classList.add("is-pressed");
    setTimeout(() => button?.classList.remove("is-pressed"), 100);
  });

  render();
})();
