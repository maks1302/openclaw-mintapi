const DEFAULT_BASE_URL = "https://api.mintapi.dev";

function toObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function resolvePluginConfig({ pluginConfig, env = process.env }) {
  const normalized = toObject(pluginConfig);
  const preferredNetworks = Array.isArray(normalized.preferredNetworks)
    ? normalized.preferredNetworks.filter((value) => typeof value === "string" && value.length > 0)
    : undefined;

  return {
    baseUrl:
      typeof normalized.baseUrl === "string" && normalized.baseUrl.length > 0
        ? normalized.baseUrl
        : env.MINTAPI_BASE_URL || DEFAULT_BASE_URL,
    signerModule:
      typeof normalized.signerModule === "string" && normalized.signerModule.length > 0
        ? normalized.signerModule
        : env.MINTAPI_SIGNER_MODULE,
    preferredNetworks,
  };
}

export function resolveSignerModulePath(api, signerModule) {
  if (!signerModule) {
    throw new Error(
      "MintAPI plugin requires plugins.entries.mintapi.config.signerModule or MINTAPI_SIGNER_MODULE.",
    );
  }

  if (signerModule.startsWith("./") || signerModule.startsWith("../")) {
    return api.resolvePath(signerModule);
  }

  return signerModule;
}

export function buildPluginRuntime({ api, createAgentClient, loadSignerModule, env = process.env }) {
  let clientPromise;

  async function getClient() {
    if (!clientPromise) {
      clientPromise = (async () => {
        const config = resolvePluginConfig({ pluginConfig: api.pluginConfig, env });
        const signerModulePath = resolveSignerModulePath(api, config.signerModule);
        const signerModule = await loadSignerModule(signerModulePath);
        const preferredNetworks =
          config.preferredNetworks && config.preferredNetworks.length > 0
            ? config.preferredNetworks
            : signerModule.preferredNetworks;

        api.logger.info("Initializing MintAPI client", {
          baseUrl: config.baseUrl,
          preferredNetworks,
        });

        return createAgentClient({
          baseUrl: config.baseUrl,
          preferredNetworks,
          getSigner: signerModule.signerResolver,
        });
      })();
    }

    return clientPromise;
  }

  return { getClient };
}
