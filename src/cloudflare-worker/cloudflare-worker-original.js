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
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
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

  const message =
    typeof body.message === "string" ? body.message.trim() : "";
  const userId =
    typeof body.userId === "string" && body.userId.trim()
      ? body.userId.trim()
      : crypto.randomUUID();
  const docs = Array.isArray(body.docs) ? body.docs : [];

  if (!message) {
    return json({ error: "Message is required" }, 400);
  }

  if (message.length > 5000) {
    return json({ error: "Message too long" }, 400);
  }

  const payload = {
    "in-0": message,
    "user_id": userId,
    ...(docs.length ? { "doc-0": docs } : {}),
  };

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

  return json({
    ok: true,
    userId,
    result,
  });
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}