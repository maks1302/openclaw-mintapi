import test from "node:test";
import assert from "node:assert/strict";

import { formatJson, textResult } from "../src/results.js";

test("formatJson pretty prints objects", () => {
  assert.equal(formatJson({ a: 1 }), '{\n  "a": 1\n}');
});

test("textResult keeps plain strings intact", () => {
  assert.deepEqual(textResult("hello"), {
    content: [{ type: "text", text: "hello" }],
  });
});

test("textResult stringifies objects", () => {
  assert.deepEqual(textResult({ ok: true }), {
    content: [{ type: "text", text: '{\n  "ok": true\n}' }],
  });
});
