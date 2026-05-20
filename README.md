# MintAPI OpenClaw Plugin

`@mintapi/openclaw-mintapi` is an OpenClaw plugin that exposes selected MintAPI paid endpoints as native OpenClaw tools.

It is built for agents and operator workflows that need to call MintAPI from inside OpenClaw while handling `402 Payment Required` flows through the MintAPI buyer SDK.

## What this plugin does

The plugin registers OpenClaw tools that call MintAPI endpoints and return the response back into the OpenClaw tool runtime.

Current tool surface:

- `mintapi_twitter_user_info`
- `mintapi_twitter_user_timeline`
- `mintapi_twitter_search`
- `mintapi_youtube_video_info`
- `mintapi_youtube_transcript`
- `mintapi_youtube_search`

The plugin does not hold seller credentials. Payment signing stays in your own signer module.

## Requirements

- OpenClaw with plugin support enabled
- Node.js compatible with your OpenClaw runtime
- access to a signer module that can satisfy MintAPI payment challenges

## Install

```bash
openclaw plugins install npm:@mintapi/openclaw-mintapi
openclaw plugins enable mintapi
```

If your OpenClaw setup does not hot-reload plugins, restart the gateway after install.

## Configuration

Configure the plugin under `plugins.entries.mintapi.config`:

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
- `preferredNetworks`: optional ordered payment network preference

Relative `signerModule` paths such as `./signers/mintapi.mjs` are resolved relative to the plugin root.

## Signer module

This plugin uses the public MintAPI buyer SDK package `@mintapi/gateway` and expects a signer module compatible with that SDK.

In practice, your signer module should export a signer module created with `defineSignerModule(...)` or another supported resolver shape from `@mintapi/gateway/client`.

Example stub:

```js
import { defineSignerModule } from "@mintapi/gateway/client";

export default defineSignerModule({
  preferredNetworks: ["base", "polygon", "solana"],
  signerResolversByFamily: {
    evm: async ({ network }) => {
      throw new Error(`Provide an EVM signer for ${network}`);
    },
    svm: async ({ network }) => {
      throw new Error(`Provide an SVM signer for ${network}`);
    },
  },
});
```

A starter file is included at [examples/signer-module.example.mjs](/Users/maksimdzura/projects/x402-api/openclaw-mintapi/examples/signer-module.example.mjs).

## Tool usage

The plugin returns JSON responses as plain text content in the OpenClaw tool result.

### `mintapi_twitter_user_info`

Fetch Twitter/X profile information.

Parameters:

- `screenname`: required
- `rest_id`: optional

Example:

```json
{
  "screenname": "elonmusk"
}
```

### `mintapi_twitter_user_timeline`

Fetch a Twitter/X timeline.

Parameters:

- `screenname`: required
- `rest_id`: optional
- `cursor`: optional

### `mintapi_twitter_search`

Search Twitter/X.

Parameters:

- `query`: required
- `search_type`: optional
- `cursor`: optional

### `mintapi_youtube_video_info`

Fetch YouTube video metadata.

Parameters:

- `id`: required
- `extend`: optional
- `geo`: optional
- `lang`: optional
- `fields`: optional

### `mintapi_youtube_transcript`

Fetch a YouTube transcript.

Parameters:

- `id`: required
- `params`: optional
- `lang`: optional

### `mintapi_youtube_search`

Search YouTube.

Parameters:

- `query`: required
- `type`: optional
- `duration`: optional
- `upload_date`: optional
- `sort_by`: optional
- `token`: optional
- `geo`: optional
- `lang`: optional
- `features`: optional
- `local`: optional
- `fields`: optional

## Behavior

- request execution goes through `@mintapi/gateway`
- when MintAPI returns a payment challenge, the SDK resolves a signer using your signer module
- the plugin retries the request with payment attached
- results are returned as OpenClaw tool content

Malformed config or missing signer setup will fail at runtime before a successful paid request can be completed.

## Local development

Link a local checkout into OpenClaw:

```bash
openclaw plugins install --link ./
openclaw plugins enable mintapi
openclaw plugins inspect mintapi --runtime --json
```

Run checks locally:

```bash
npm test
npm run check
npm run pack:dry-run
```

## Related docs

- publish and release flow: [PUBLISHING.md](/Users/maksimdzura/projects/x402-api/openclaw-mintapi/PUBLISHING.md)
- OpenClaw directory submission copy: [SUBMISSION.md](/Users/maksimdzura/projects/x402-api/openclaw-mintapi/SUBMISSION.md)
