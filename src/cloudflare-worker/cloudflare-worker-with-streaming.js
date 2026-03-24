export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    try {
      if (url.pathname === "/health" && request.method === "GET") {
        return json({ ok: true, service: "docduit-worker" });
      }

      if (url.pathname === "/api/chat" && request.method === "POST") {
        return await handleChat(request, env);
      }

      return json({ error: "Not found" }, 404);
    } catch (error) {
      return json(
        {
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Expose-Headers": "X-Docduit-User-Id",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}

async function handleChat(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const rawMessage = body.message || body.question || body.input || body["in-0"];
  const message =
    typeof rawMessage === "string" ? rawMessage.trim() : "";

  const userId =
    typeof body.userId === "string" && body.userId.trim()
      ? body.userId.trim()
      : crypto.randomUUID();

  const docs = Array.isArray(body.docs) ? body.docs : [];

  const history = Array.isArray(body.history) ? body.history : [];

  if (!message) {
    return json({ error: "Message is required" }, 400);
  }

  if (message.length > 5000) {
    return json({ error: "Message too long" }, 400);
  }

  const formattedHistory = history
    .map((h) => `Q: ${h.pertanyaan}\nA: ${h.jawaban}`)
    .join("\n\n");

  const finalPrompt = formattedHistory
    ? `${formattedHistory}\n\nUser: ${message}`
    : message;

  const payload = {
    "in-0": finalPrompt, 
    "user_id": userId,
    ...(docs.length ? { "doc-0": docs } : {}),
  };

  const wantsStreaming =
    body.stream === true ||
    (request.headers.get("accept") || "")
      .toLowerCase()
      .includes("text/event-stream");

  if (wantsStreaming) {
    const stackUrl = `https://api.stack-ai.com/inference/v0/stream/${env.STACK_ORG_ID}/${env.STACK_FLOW_ID}`;

    const response = await fetch(stackUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STACK_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const rawText = await response.text().catch(() => "");
      return json(
        {
          error: "Stack AI request failed",
          status: response.status,
          details: tryParseJson(rawText) ?? rawText,
        },
        response.status
      );
    }

    if (!response.body) {
      return json(
        { error: "Stack AI streaming response missing body" },
        502
      );
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Docduit-User-Id": userId,
        "Access-Control-Expose-Headers": "X-Docduit-User-Id",
        ...corsHeaders(),
      },
    });
  }

  // Non-stream fallback
  const stackUrl = `https://api.stack-ai.com/inference/v0/run/${env.STACK_ORG_ID}/${env.STACK_FLOW_ID}`;

  const response = await fetch(stackUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STACK_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();

  if (!response.ok) {
    return json(
      {
        error: "Stack AI request failed",
        status: response.status,
        details: tryParseJson(rawText) ?? rawText,
      },
      response.status
    );
  }

  const result = tryParseJson(rawText) ?? { raw: rawText };
  return json({ ok: true, userId, result });
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}