import { createAgentClient, loadSignerModule } from "@mintapi/gateway/client";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

import { buildPluginRuntime } from "./src/runtime.js";
import { registerTools } from "./src/tools.js";

const PLUGIN_ID = "mintapi";
const PLUGIN_NAME = "MintAPI";

export default definePluginEntry({
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  description: "Expose MintAPI paid API endpoints as OpenClaw tools.",
  register(api) {
    const runtime = buildPluginRuntime({
      api,
      createAgentClient,
      loadSignerModule,
    });

    registerTools(api, runtime);
  },
});
