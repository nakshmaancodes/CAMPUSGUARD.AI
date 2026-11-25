import dotenv from 'dotenv';
dotenv.config();

const key = process.env.TINYFISH_API_KEY;

async function runTinyFishTask() {
  console.log('================================================================');
  console.log('🐟 EXECUTING TINYFISH SEARCH & FETCH FOR AI DEVELOPER PROJECTS');
  console.log('================================================================\n');

  // Step 1: Search using TinyFish Search API
  const query = 'newly released rapidly growing AI developer projects tools GitHub';
  console.log(`[TinyFish Search] Querying: "${query}"...`);
  
  const searchUrl = `https://agent.tinyfish.ai/v1/search?query=${encodeURIComponent(query)}&location=US`;
  const searchRes = await fetch(searchUrl, {
    headers: {
      'X-API-Key': key,
      'Authorization': `Bearer ${key}`
    }
  });

  const searchData = await searchRes.json();
  const results = searchData.results || [];
  console.log(`[TinyFish Search] Received ${results.length} ranked results.\n`);

  // Target high-impact AI developer projects
  const topProjects = [
    {
      name: "Browser-Use",
      url: "https://github.com/browser-use/browser-use",
      queryFallback: "Make websites accessible for AI agents"
    },
    {
      name: "FastMCP",
      url: "https://github.com/jlowin/fastmcp",
      queryFallback: "The fastest way to build Model Context Protocol servers in Python"
    },
    {
      name: "Langfuse",
      url: "https://github.com/langfuse/langfuse",
      queryFallback: "Open source LLM engineering platform - Observability, metrics, evaluations"
    }
  ];

  // Step 2: Fetch Documentation & READMEs using TinyFish Fetch API
  console.log('[TinyFish Fetch] Fetching documentation & READMEs for top projects...');
  const urlsToFetch = topProjects.map(p => p.url);

  const fetchRes = await fetch('https://agent.tinyfish.ai/v1/fetch', {
    method: 'POST',
    headers: {
      'X-API-Key': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ urls: urlsToFetch })
  });

  const fetchData = await fetchRes.json();
  const fetchedResults = fetchData.results || [];
  console.log(`[TinyFish Fetch] Successfully fetched ${fetchedResults.length} project documents.\n`);

  return {
    searchCount: results.length,
    projects: fetchedResults.map((item, idx) => ({
      name: topProjects[idx].name,
      url: item.url,
      title: item.title,
      summary: (item.text || item.description || '').slice(0, 450)
    }))
  };
}

runTinyFishTask().then(data => {
  console.log('Execution Summary:');
  console.log(JSON.stringify(data, null, 2));
}).catch(console.error);
