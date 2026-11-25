import dotenv from 'dotenv';
dotenv.config();
import { processChatWithGroq } from '../services/groqService.js';

async function testGroqIntegration() {
  console.log('Testing live chat query to Groq...');
  const result = await processChatWithGroq('My landlord charged 3000 rupees for 280 units in Delhi');
  console.log('Groq Live Result:', JSON.stringify(result, null, 2));
}

testGroqIntegration();
