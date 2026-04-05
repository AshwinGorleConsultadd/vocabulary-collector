const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: 'gemini-pro' }); // Just to init
    // Actually the SDK doesn't have a direct 'listModels' in the same way 
    // unless we use the rest API or a different part of the SDK.
    // But let's try to see if we can hit it.
    console.log('Key:', process.env.GEMINI_API_KEY.substring(0, 5) + '...');
  } catch (e) {
    console.error(e);
  }
}

listModels();
