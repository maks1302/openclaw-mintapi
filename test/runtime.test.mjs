import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPluginRuntime,
  resolvePluginConfig,
  resolveSignerModulePath,
} from "../src/runtime.js";

test("resolvePluginConfig prefers explicit plugin config", () => {
  const result = resolvePluginConfig({
    pluginConfig: {
      baseUrl: "https://custom.example",
      signerModule: "./signer.mjs",
      preferredNetworks: ["base", "polygon", "", 7],
    },
    env: {
      MINTAPI_BASE_URL: "https://env.example",
      MINTAPI_SIGNER_MODULE: "/env/signer.mjs",
    },
  });

  assert.deepEqual(result, {
    baseUrl: "https://custom.example",
    signerModule: "./signer.mjs",
    preferredNetworks: ["base", "polygon"],
  });
});

test("resolvePluginConfig falls back to env and defaults", () => {
  const result = resolvePluginConfig({
    pluginConfig: {},
    env: {
      MINTAPI_SIGNER_MODULE: "/env/signer.mjs",
    },
  });

  assert.equal(result.baseUrl, "https://api.mintapi.dev");
  assert.equal(result.signerModule, "/env/signer.mjs");
  assert.equal(result.preferredNetworks, undefined);
});

test("resolveSignerModulePath resolves relative paths against plugin root", () => {
  const api = {
    resolvePath(value) {
      return `/plugin-root/${value.replace(/^\.\//, "")}`;
    },
  };

  assert.equal(resolveSignerModulePath(api, "./signer.mjs"), "/plugin-root/signer.mjs");
  assert.equal(resolveSignerModulePath(api, "/abs/signer.mjs"), "/abs/signer.mjs");
});

test("buildPluginRuntime initializes the client once", async () => {
  let loadCalls = 0;
  let createCalls = 0;

  const api = {
    pluginConfig: {
      signerModule: "./signer.mjs",
      preferredNetworks: ["base"],
    },
    logger: { info() {} },
    resolvePath(value) {
      return `/plugin-root/${value.replace(/^\.\//, "")}`;
    },
  };

  const runtime = buildPluginRuntime({
    api,
    env: {},
    async loadSignerModule(path) {
      loadCalls += 1;
      assert.equal(path, "/plugin-root/signer.mjs");
      return {
        preferredNetworks: ["polygon"],
        signerResolver: async () => ({ signer: true }),
      };
    },
    createAgentClient(options) {
      createCalls += 1;
      assert.equal(options.baseUrl, "https://api.mintapi.dev");
      assert.deepEqual(options.preferredNetworks, ["base"]);
      return { ok: true };
    },
  });

  const first = await runtime.getClient();
  const second = await runtime.getClient();

  assert.deepEqual(first, { ok: true });
  assert.equal(first, second);
  assert.equal(loadCalls, 1);
  assert.equal(createCalls, 1);
});
