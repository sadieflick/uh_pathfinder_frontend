// Netlify Function: LLM chat proxy (OpenAI)
// Requires env var: OPENAI_API_KEY

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'Missing OPENAI_API_KEY' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const userText = body.text || '';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const system = body.system || 'You are a concise, helpful UH Pathfinder assistant. Focus on Hawaiʻi programs and clear next steps.';

    // Build OpenAI messages array. Include system prompt first.
    const openAiMessages = [];
    if (system) {
      openAiMessages.push({ role: 'system', content: system });
    }
    for (const m of messages) {
      if (!m || !m.role || !m.content) continue;
      openAiMessages.push({ role: m.role, content: m.content });
    }
    if (userText) {
      openAiMessages.push({ role: 'user', content: userText });
    }

    const model = body.model || 'gpt-4o-mini';
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: openAiMessages,
        temperature: body.temperature ?? 0.2,
        max_tokens: body.max_tokens || 512,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return { statusCode: resp.status, body: `Upstream error: ${errText}` };
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reply: content, modelUsed: model, raw: data }),
    };
  } catch (e) {
    return { statusCode: 500, body: `Error: ${e.message}` };
  }
}
