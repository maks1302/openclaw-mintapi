import { textResult } from "./results.js";

function registerTool(api, definition) {
  api.registerTool(definition);
}

export function registerTools(api, runtime) {
  registerTool(api, {
    name: "mintapi_twitter_user_info",
    description: "Fetch Twitter/X profile information through MintAPI.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        screenname: {
          type: "string",
          description: "Twitter/X handle without the @ prefix.",
        },
        rest_id: {
          type: "string",
          description: "Optional numeric Twitter/X rest_id for disambiguation.",
        },
      },
      required: ["screenname"],
    },
    async execute(_id, params) {
      const client = await runtime.getClient();
      const result = await client.twitter.userInfo({
        screenname: params.screenname,
        rest_id: params.rest_id,
      });
      return textResult(result);
    },
  });

  registerTool(api, {
    name: "mintapi_twitter_user_timeline",
    description: "Fetch a Twitter/X user timeline through MintAPI.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        screenname: {
          type: "string",
          description: "Twitter/X handle without the @ prefix.",
        },
        rest_id: {
          type: "string",
          description: "Optional numeric Twitter/X rest_id for disambiguation.",
        },
        cursor: {
          type: "string",
          description: "Optional pagination cursor.",
        },
      },
      required: ["screenname"],
    },
    async execute(_id, params) {
      const client = await runtime.getClient();
      const result = await client.twitter.userTimeline({
        screenname: params.screenname,
        rest_id: params.rest_id,
        cursor: params.cursor,
      });
      return textResult(result);
    },
  });

  registerTool(api, {
    name: "mintapi_twitter_search",
    description: "Search Twitter/X through MintAPI.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: {
          type: "string",
          description: "Search query.",
        },
        search_type: {
          type: "string",
          description: "Optional search mode such as Top or Latest.",
        },
        cursor: {
          type: "string",
          description: "Optional pagination cursor.",
        },
      },
      required: ["query"],
    },
    async execute(_id, params) {
      const client = await runtime.getClient();
      const result = await client.twitter.search({
        query: params.query,
        search_type: params.search_type,
        cursor: params.cursor,
      });
      return textResult(result);
    },
  });

  registerTool(api, {
    name: "mintapi_youtube_video_info",
    description: "Fetch YouTube video metadata through MintAPI.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        id: {
          type: "string",
          description: "YouTube video id.",
        },
        extend: {
          anyOf: [{ type: "string" }, { type: "number" }],
          description: "Optional MintAPI extend mode.",
        },
        geo: {
          type: "string",
          description: "Optional geographic code, for example US.",
        },
        lang: {
          type: "string",
          description: "Optional language code, for example en.",
        },
        fields: {
          type: "string",
          description: "Optional response projection.",
        },
      },
      required: ["id"],
    },
    async execute(_id, params) {
      const client = await runtime.getClient();
      const result = await client.youtube.videoInfo({
        id: params.id,
        extend: params.extend,
        geo: params.geo,
        lang: params.lang,
        fields: params.fields,
      });
      return textResult(result);
    },
  });

  registerTool(api, {
    name: "mintapi_youtube_transcript",
    description: "Fetch a YouTube transcript through MintAPI.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        id: {
          type: "string",
          description: "YouTube video id.",
        },
        params: {
          type: "string",
          description: "Optional MintAPI transcript params token.",
        },
        lang: {
          type: "string",
          description: "Optional language code, for example en.",
        },
      },
      required: ["id"],
    },
    async execute(_id, params) {
      const client = await runtime.getClient();
      const result = await client.youtube.transcript({
        id: params.id,
        params: params.params,
        lang: params.lang,
      });
      return textResult(result);
    },
  });

  registerTool(api, {
    name: "mintapi_youtube_search",
    description: "Search YouTube through MintAPI.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: {
          type: "string",
          description: "Search query.",
        },
        type: {
          type: "string",
          description: "Optional result type such as video, shorts, or channel.",
        },
        duration: {
          type: "string",
          description: "Optional duration filter.",
        },
        upload_date: {
          type: "string",
          description: "Optional upload date filter.",
        },
        sort_by: {
          type: "string",
          description: "Optional sort order.",
        },
        token: {
          type: "string",
          description: "Optional pagination token.",
        },
        geo: {
          type: "string",
          description: "Optional geographic code, for example US.",
        },
        lang: {
          type: "string",
          description: "Optional language code, for example en.",
        },
        features: {
          type: "string",
          description: "Optional comma-separated features filter.",
        },
        local: {
          anyOf: [{ type: "string" }, { type: "number" }],
          description: "Optional local search mode toggle.",
        },
        fields: {
          type: "string",
          description: "Optional response projection.",
        },
      },
      required: ["query"],
    },
    async execute(_id, params) {
      const client = await runtime.getClient();
      const result = await client.youtube.search({
        query: params.query,
        type: params.type,
        duration: params.duration,
        upload_date: params.upload_date,
        sort_by: params.sort_by,
        token: params.token,
        geo: params.geo,
        lang: params.lang,
        features: params.features,
        local: params.local,
        fields: params.fields,
      });
      return textResult(result);
    },
  });
}
