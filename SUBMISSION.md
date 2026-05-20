# OpenClaw Directory Submission

Use this when submitting to `openclawdir.com`.

- Plugin Name: `MintAPI`
- Description: `Expose MintAPI paid Twitter/X and YouTube endpoints as native OpenClaw tools with x402-aware payment handling.`
- Install Command: `openclaw plugins install npm:@mintapi/openclaw-mintapi`
- Configuration Example:

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

- Category: `Integration`
- Homepage URL: `https://docs.mintapi.dev`
- GitHub URL: `https://github.com/maks1302/openclaw-mintapi`
- Tags: `mintapi, x402, payments, twitter, youtube, data`
- Author Name: `Maksim Dzura`
- Author URL: `https://github.com/maks1302`
