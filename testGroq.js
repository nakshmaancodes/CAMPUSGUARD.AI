import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
  for (const model of models) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are Sentinel AI. Answer in JSON with a "status" field.' },
            { role: 'user', content: 'Hello!' }
          ],
          response_format: { type: 'json_object' }
        })
      });
      const data = await res.json();
      console.log(`Status for ${model}: ${res.status}`);
      if (res.ok) {
        console.log('Response content:', data.choices[0]?.message?.content);
        return model;
      } else {
        console.log('Error details:', data.error);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

main();
