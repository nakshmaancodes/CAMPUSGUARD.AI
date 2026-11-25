import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const zipOutput = path.join(projectRoot, 'CampusGuardAI_SENTINEL.zip');

console.log('Generating CampusGuardAI_SENTINEL.zip...');

try {
  if (fs.existsSync(zipOutput)) {
    fs.unlinkSync(zipOutput);
  }

  // Windows built-in tar supports zip archives with -a
  const tarCommand = `tar -a -cf "${zipOutput}" --exclude=node_modules --exclude=.git --exclude=CampusGuardAI_SENTINEL.zip *`;
  execSync(tarCommand, { cwd: projectRoot, stdio: 'inherit' });

  if (fs.existsSync(zipOutput)) {
    const stats = fs.statSync(zipOutput);
    console.log(`✅ Successfully generated: ${zipOutput} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    throw new Error('Zip file was not generated.');
  }
} catch (err) {
  console.error('Failed to create zip:', err.message);
}
