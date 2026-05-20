# MintAPI OpenClaw Plugin

`@mintapi/openclaw-mintapi` is an OpenClaw plugin that exposes selected MintAPI paid endpoints as native OpenClaw tools.

It is built for agents and operator workflows that need paid access to social and video data inside OpenClaw while delegating payment signing to your own infrastructure.

## What this plugin does

The plugin registers OpenClaw tools backed by MintAPI. Requests go through the public MintAPI buyer SDK, which handles `402 Payment Required` flows and retries with payment attached after resolving a signer from your configured signer module.

The plugin does not hold seller credentials or private keys.

## Current tool surface

Twitter/X:

- `mintapi_twitter_user_info`
- `mintapi_twitter_user_timeline`
- `mintapi_twitter_search`
- `mintapi_twitter_tweet_info`
- `mintapi_twitter_user_replies`
- `mintapi_twitter_trends`

YouTube:

- `mintapi_youtube_video_info`
- `mintapi_youtube_related`
- `mintapi_youtube_transcript`
- `mintapi_youtube_comments`
- `mintapi_youtube_search`

## Requirements

- OpenClaw with plugin support enabled
- Node.js compatible with your OpenClaw runtime
- a signer module that can satisfy MintAPI payment challenges

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

Example:

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

Starter file:

- [`examples/signer-module.example.mjs`](./examples/signer-module.example.mjs)

## Usage

The plugin returns MintAPI responses as text content in the OpenClaw tool result. Most tools are thin wrappers over MintAPI endpoints and keep parameter names aligned with MintAPI where practical.

### Twitter/X tools

`mintapi_twitter_user_info`

- `screenname`: required
- `rest_id`: optional

Example:

```json
{
  "screenname": "elonmusk"
}
```

`mintapi_twitter_user_timeline`

- `screenname`: required
- `rest_id`: optional
- `cursor`: optional

`mintapi_twitter_search`

- `query`: required
- `search_type`: optional
- `cursor`: optional

`mintapi_twitter_tweet_info`

- `id`: required

`mintapi_twitter_user_replies`

- `screenname`: required
- `cursor`: optional

`mintapi_twitter_trends`

- `country`: required

Example:

```json
{
  "country": "UnitedStates"
}
```

### YouTube tools

`mintapi_youtube_video_info`

- `id`: required
- `extend`: optional
- `geo`: optional
- `lang`: optional
- `fields`: optional

`mintapi_youtube_related`

- `id`: required
- `token`: optional
- `geo`: optional
- `lang`: optional
- `fields`: optional

`mintapi_youtube_transcript`

- `id`: required
- `params`: optional
- `lang`: optional

`mintapi_youtube_comments`

- `id`: required
- `token`: optional
- `sort_by`: optional
- `geo`: optional
- `lang`: optional
- `fields`: optional

`mintapi_youtube_search`

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

## Troubleshooting

`Plugin loads but tool calls fail immediately`

- verify `plugins.entries.mintapi.enabled` is `true`
- verify `signerModule` points to a real file
- if you use a relative signer path, verify it is relative to the plugin root

`Missing signer module` or `requires signerModule`

- set `plugins.entries.mintapi.config.signerModule`
- or set `MINTAPI_SIGNER_MODULE` in the OpenClaw runtime environment

`Payment challenge cannot be satisfied`

- your signer module is loading, but it is not returning a signer that matches one of the accepted payment networks
- align `preferredNetworks` with the signer families you actually support

`Package installs but plugin does not appear`

- restart the OpenClaw gateway
- run `openclaw plugins inspect mintapi --runtime --json`
- verify the plugin is enabled

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

- [PUBLISHING.md](./PUBLISHING.md)
- [SUBMISSION.md](./SUBMISSION.md)
