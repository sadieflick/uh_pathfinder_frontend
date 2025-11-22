// Netlify Function: LLM chat proxy (Anthropic)
// Requires env var: ANTHROPIC_API_KEY

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'Missing ANTHROPIC_API_KEY' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const userText = body.text || '';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const system = body.system || 'You are a concise, helpful UH Pathfinder assistant. Focus on Hawaiʻi programs and clear next steps.';

    const anthropicMessages = [];
    if (userText) {
      anthropicMessages.push({ role: 'user', content: userText });
    }
    for (const m of messages) {
      if (!m || !m.role || !m.content) continue;
      anthropicMessages.push({ role: m.role, content: m.content });
    }

    const model = body.model || 'claude-3-5-haiku-latest';
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: body.max_tokens || 512,
        temperature: body.temperature ?? 0.2,
        system,
        messages: anthropicMessages,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return { statusCode: resp.status, body: `Upstream error: ${errText}` };
    }

    const data = await resp.json();
    const content = Array.isArray(data.content) && data.content[0]?.type === 'text' ? data.content[0].text : '';

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reply: content, modelUsed: model, raw: data }),
    };
  } catch (e) {
    return { statusCode: 500, body: `Error: ${e.message}` };
  }
}
