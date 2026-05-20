# openclaw-mintapi

`openclaw-mintapi` is a native OpenClaw plugin that exposes selected MintAPI paid endpoints as OpenClaw tools.

Current tool surface:

- `mintapi_twitter_user_info`
- `mintapi_twitter_user_timeline`
- `mintapi_twitter_search`
- `mintapi_youtube_video_info`
- `mintapi_youtube_transcript`
- `mintapi_youtube_search`

The plugin uses the public buyer SDK package `@mintapi/gateway` and expects a signer module that can answer MintAPI payment challenges.

## Why this should be a separate repo

This plugin should live in its own public repository because it has a different release and support boundary from:

- the private seller gateway
- the public buyer SDK

That separation keeps plugin issues, npm metadata, OpenClaw compatibility, and directory submissions isolated from backend changes.

## Install

```bash
openclaw plugins install npm:@mintapi/openclaw-mintapi
openclaw plugins enable mintapi
```

Restart the OpenClaw Gateway if your setup does not auto-reload plugins after install.

## Configuration

Add plugin config under `plugins.entries.mintapi.config`:

```json5
{
  plugins: {
    entries: {
      mintapi: {
        enabled: true,
        config: {
          baseUrl: "https://api.mintapi.dev",
          signerModule: "/absolute/path/to/signer-module.mjs",
          preferredNetworks: ["base", "polygon", "solana"]
        }
      }
    }
  }
}
```

Config fields:

- `baseUrl`: optional, defaults to `https://api.mintapi.dev`
- `signerModule`: required unless `MINTAPI_SIGNER_MODULE` is set
- `preferredNetworks`: optional override for payment routing preference

Relative `signerModule` paths like `./signers/mintapi.mjs` are resolved relative to the plugin root.

## Signer module

The signer module must satisfy the loader expectations from `@mintapi/gateway/client`. In practice, it should export a signer module created with `defineSignerModule(...)` or another supported signer resolver shape.

An example stub is included at [examples/signer-module.example.mjs](/Users/maksimdzura/projects/x402-api/openclaw-mintapi/examples/signer-module.example.mjs).

## Local development

Link the plugin from a local checkout:

```bash
openclaw plugins install --link ./openclaw-mintapi
openclaw plugins inspect mintapi --runtime --json
```

Run local checks:

```bash
npm test
npm run check
```

## Publish checklist

1. Move this folder into its own Git repository, for example `openclaw-mintapi`.
2. Publish the package to npm.
3. Validate install from a clean OpenClaw environment.
4. Publish to ClawHub if you want first-class OpenClaw discovery.
5. Submit the plugin to `openclawdir.com`.

## Suggested OpenClaw Directory submission

- Plugin Name: `MintAPI`
- Description: `Expose MintAPI paid Twitter/X and YouTube endpoints as native OpenClaw tools with x402-aware payment handling.`
- Install Command: `openclaw plugins install npm:@mintapi/openclaw-mintapi`
- Category: `Integration`
- Tags: `mintapi, x402, payments, twitter, youtube, data`
