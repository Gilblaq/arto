export async function onRequestPost({ request, env }) {
  if (!env.OPENAI_API_KEY) {
    return Response.json({
      error: "GeoMate AI is not connected yet. The study pages and saved questions work, but a site owner must add OPENAI_API_KEY as a Cloudflare Pages secret to enable live AI answers."
    }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please send a valid question." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > 4000) {
    return Response.json({ error: "Enter a question of up to 4,000 characters." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are GeoMate, a patient tutor for a university student studying geological engineering. Explain geology and engineering geology accurately in clear, accessible English. Use headings or numbered steps when helpful, define technical terms, include practical examples, and distinguish established facts from uncertainty. For safety-critical engineering questions, explain that site-specific decisions require qualified professionals and real investigations. Do not invent measurements, field observations, or citations."
          },
          { role: "user", content: question }
        ],
        temperature: 0.4,
        max_tokens: 900
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({
        error: "The AI service could not answer right now. Check the API key and provider account, then try again."
      }, { status: 502 });
    }

    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return Response.json({ error: "GeoMate did not receive an answer. Please try again." }, { status: 502 });
    }
    return Response.json({ answer });
  } catch {
    return Response.json({ error: "Unable to reach the AI service right now. Please try again." }, { status: 502 });
  }
}