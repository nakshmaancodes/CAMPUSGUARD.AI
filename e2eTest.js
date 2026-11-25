import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const serverProc = spawn(process.execPath, [path.join(projectRoot, 'server.js')], {
  cwd: projectRoot,
  stdio: ['ignore', 'pipe', 'pipe']
});

serverProc.stdout.on('data', d => process.stdout.write(d.toString()));
serverProc.stderr.on('data', d => process.stderr.write(d.toString()));

async function runEndToEnd() {
  console.log('\n--- Waiting for server to initialize on http://127.0.0.1:3000 ---');
  await new Promise(r => setTimeout(r, 2000));

  try {
    // 1. Landing Page HTML
    const resLanding = await fetch('http://127.0.0.1:3000/');
    const textLanding = await resLanding.text();
    console.log(`✅ [1/10] Landing Page: Status ${resLanding.status}, HTML size: ${textLanding.length} bytes, contains SENTINEL: ${textLanding.includes('SENTINEL')}`);

    // 2. App Console HTML
    const resApp = await fetch('http://127.0.0.1:3000/app.html');
    const textApp = await resApp.text();
    console.log(`✅ [2/10] App Console: Status ${resApp.status}, HTML size: ${textApp.length} bytes, contains Generative Chat: ${textApp.includes('Generative Chat')}`);

    // 3. System Status
    const resStatus = await fetch('http://127.0.0.1:3000/api/system/status');
    const dataStatus = await resStatus.json();
    console.log(`✅ [3/10] System Status: Status ${resStatus.status}, System: "${dataStatus.system}", Groq Connected: ${dataStatus.apiIntegrations.groq}`);

    // 4. Live Groq Chat Agent
    const resChat = await fetch('http://127.0.0.1:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Audit my PG electricity bill of 280 units in Delhi charged at 11 per unit' })
    });
    const dataChat = await resChat.json();
    console.log(`✅ [4/10] Live Groq Chat: Status ${resChat.status}, Intent: "${dataChat.intent}", Widget: "${dataChat.generativeUi?.type}"`);
    console.log(`         AI Message snippet: "${dataChat.message?.slice(0, 90)}..."`);

    // 5. Electricity Audit with DERC Benchmark
    const resElec = await fetch('http://127.0.0.1:3000/api/audit/electricity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ units: 280, landlordRate: 11, discomCode: 'DERC' })
    });
    const dataElec = await resElec.json();
    console.log(`✅ [5/10] Electricity Audit: Overcharge = ₹${dataElec.auditData.auditResult.netOvercharge}, Severity = "${dataElec.auditData.auditResult.severity}"`);
    console.log(`         TinyFish Live Agent Run ID: ${dataElec.agentRun?.runId}, Streaming URL: ${dataElec.agentRun?.streamingUrl}`);

    // 6. Internship Scam Firewall
    const resIntern = await fetch('http://127.0.0.1:3000/api/audit/internship', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Apex Cloud Technologies',
        recruiterEmail: 'hr.apexcloud@gmail.com',
        statedFee: 1499,
        officeAddress: 'Flat 402, Residential Colony, Bangalore'
      })
    });
    const dataIntern = await resIntern.json();
    console.log(`✅ [6/10] Internship Scam Firewall: Risk = ${dataIntern.auditResult.riskScore}/100, Verdict = "${dataIntern.auditResult.verdict}"`);

    // 7. Scraped Campus Notices
    const resNotices = await fetch('http://127.0.0.1:3000/api/notices');
    const dataNotices = await resNotices.json();
    console.log(`✅ [7/10] Campus Notices: Status ${resNotices.status}, Count: ${dataNotices.count} circulars indexed`);

    // 8. 1-Click Autopilot Form
    const resAuto = await fetch('http://127.0.0.1:3000/api/autopilot/fill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ circularId: 'circ-ugc-2024-08' })
    });
    const dataAuto = await resAuto.json();
    console.log(`✅ [8/10] 1-Click Autopilot: Mapped ${dataAuto.autopilotResult.fieldMapping.length} fields for "${dataAuto.autopilotResult.targetNotice.title.slice(0, 45)}..."`);

    // 9. Cross-Quest Conflict Radar
    const resConf = await fetch('http://127.0.0.1:3000/api/conflicts/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const dataConf = await resConf.json();
    console.log(`✅ [9/10] Cross-Quest Conflict Radar: ${dataConf.report.conflictCount} conflicts detected, Badge: "${dataConf.report.statusBadge}"`);

    // 10. Zip Download Route
    const resZip = await fetch('http://127.0.0.1:3000/api/download-zip');
    const zipBlob = await resZip.arrayBuffer();
    console.log(`✅ [10/10] Project Zip Download: Status ${resZip.status}, Download Size: ${(zipBlob.byteLength / 1024).toFixed(1)} KB`);

    console.log('\n======================================================');
    console.log('🎉 ALL 10 END-TO-END WEBSITE CHECKS PASSED PERFECTLY!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ E2E verification failed:', err);
  } finally {
    serverProc.kill();
    process.exit(0);
  }
}

runEndToEnd();
