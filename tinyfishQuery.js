import dotenv from 'dotenv';
dotenv.config();

const key = process.env.TINYFISH_API_KEY || 'sk-tinyfish-MZswc7X9-VAzLaj3ZWCqTkOzbphsqMyu';

async function executeTinyFishWorkflow() {
  console.log('======================================================');
  console.log('🐟 EXECUTING AUTHENTICATED TINYFISH SEARCH & FETCH');
  console.log('======================================================\n');
  console.log(`Using API Key: ${key.slice(0, 15)}...${key.slice(-4)}`);

  // 1. Search for rapidly growing AI projects
  console.log('\n--- 1. Querying TinyFish Search API ---');
  const query = 'rapidly growing AI developer projects open source github 2024';
  const searchRes = await fetch('https://agent.tinyfish.ai/v1/search', {
    method: 'POST',
    headers: {
      'X-API-Key': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      recency_minutes: 10080
    })
  });

  console.log(`TinyFish Search HTTP Status: ${searchRes.status}`);
  const searchData = await searchRes.json();
  const results = searchData.results || [];
  console.log(`Total Search Results Returned: ${results.length}`);

  if (results.length === 0) {
    console.log('Raw search response:', JSON.stringify(searchData));
    return;
  }

  console.log('\nTop 3 Discovered AI Developer Projects:');
  results.slice(0, 3).forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.title}] -> ${r.url}`);
    if (r.snippet) console.log(`   Snippet: ${r.snippet.slice(0, 120)}...`);
  });

  // 2. Fetch the top result documentation / README via TinyFish Fetch
  const targetUrl = results[0].url;
  console.log(`\n--- 2. Querying TinyFish Fetch API for: ${targetUrl} ---`);
  const fetchRes = await fetch('https://agent.tinyfish.ai/v1/fetch', {
    method: 'POST',
    headers: {
      'X-API-Key': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: targetUrl })
  });

  console.log(`TinyFish Fetch HTTP Status: ${fetchRes.status}`);
  const fetchData = await fetchRes.json();
  const content = fetchData.markdown || fetchData.content || fetchData.text || '';
  console.log(`Extracted Page Title: "${fetchData.title || 'Untitled'}"`);
  console.log(`Extracted Content Length: ${content.length} characters`);
  console.log('\n--- Summary Excerpt ---');
  console.log(content.slice(0, 500) + '...');

  console.log('\n======================================================');
  console.log('🎉 TINYFISH SEARCH & FETCH COMPLETED SUCCESSFULLY!');
  console.log('======================================================\n');
}

executeTinyFishWorkflow().catch(console.error);
