export function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

export function textResult(value) {
  return {
    content: [
      {
        type: "text",
        text: typeof value === "string" ? value : formatJson(value),
      },
    ],
  };
}
