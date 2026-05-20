# Next Steps

This file tracks the highest-priority work for `@mintapi/openclaw-mintapi` after the current endpoint and docs pass.

## Immediate

1. Validate clean install from npm in a fresh OpenClaw environment
2. Verify a real signer module works end-to-end against MintAPI payment challenges
3. Confirm all current tools execute successfully at least once:
   - `mintapi_twitter_user_info`
   - `mintapi_twitter_user_timeline`
   - `mintapi_twitter_search`
   - `mintapi_twitter_tweet_info`
   - `mintapi_twitter_user_replies`
   - `mintapi_twitter_trends`
   - `mintapi_youtube_video_info`
   - `mintapi_youtube_related`
   - `mintapi_youtube_transcript`
   - `mintapi_youtube_comments`
   - `mintapi_youtube_search`

## Release

1. Publish the first npm release manually if not already done
2. Set up npm trusted publishing for `maks1302/openclaw-mintapi`
3. Cut and publish `v0.1.1`
4. Verify that tag-based publishing works without manual intervention

## Product quality

1. Add a short smoke-test checklist for manual OpenClaw validation
2. Improve error handling and user-facing diagnostics for:
   - missing signer module
   - invalid signer module shape
   - unsupported payment network
   - MintAPI request failure
3. Decide whether tool responses should remain plain text JSON or evolve into richer OpenClaw result content

## Endpoint expansion

Prioritize breadth only after install and runtime confidence are proven.

Recommended next batch:

1. YouTube:
   - channel videos
   - channel about
   - playlist
2. Twitter/X:
   - latest replies
   - followers
   - following
3. Only after that, evaluate one new provider:
   - Instagram first
   - TikTok second

## Docs

1. Add a dedicated troubleshooting section for common signer/payment failures if real users hit them
2. Add one real config example using a managed signer setup
3. Add a short examples page showing realistic agent prompts and corresponding tool usage

## Feedback loop

1. Watch which tools are actually used
2. Expand the plugin based on demand, not by mirroring the entire MintAPI surface
3. Keep the OpenClaw plugin narrower and easier to operate than the raw SDK
