import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.DOMAIN || 'http://localhost:3000',
        'X-Title': 'JEEVAN Animal Welfare',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful and friendly animal care assistant for JEEVAN Animal Welfare.',
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    // Log full response for debugging
    if (!response.ok || !data.choices || !data.choices[0]) {
      console.error('OpenRouter API error:', JSON.stringify(data));
      const errMsg = data?.error?.message || 'Failed to respond.';
      return NextResponse.json({ message: `⚠️ Error: ${errMsg}` }, { status: 500 });
    }

    return NextResponse.json({ message: data.choices[0].message.content });
  } catch (err: unknown) {
    console.error('Error in chatbot route:', err);
    return NextResponse.json({ message: '⚠️ Error: Unable to reach server.' }, { status: 500 });
  }
}
