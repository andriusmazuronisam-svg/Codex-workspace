# Simple Calculator

A clean, responsive calculator for addition, subtraction, multiplication, and division. It works entirely in the browser and supports mouse, touch, and keyboard input.

## Run locally

Open `index.html` directly, or serve the directory with any static file server:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Keyboard controls

- `0`–`9` and `.` enter numbers
- `+`, `-`, `*`, and `/` choose an operation
- `Enter` or `=` calculates the result
- `Escape` clears the calculator
- `Backspace` removes the last digit

## Test

```bash
node --test
```
