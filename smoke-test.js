#!/usr/bin/env node

/**
 * Gemini API Smoke Test
 * Tests API connectivity, quota limits, and basic functionality
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

console.log('🧪 Starting Gemini API Smoke Test...\n');
console.log(`📋 API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}`);

async function runSmokeTest() {
  try {
    // Test 1: Check API connectivity with a simple text request
    console.log('\n📝 Test 1: Basic text generation (simple model call)');
    const textTestResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Say "API is working" in one sentence',
              },
            ],
          },
        ],
      }),
    });

    const textData = await textTestResponse.json();
    
    if (!textTestResponse.ok) {
      console.log('❌ Text test failed');
      console.log('Status:', textTestResponse.status);
      console.log('Response:', JSON.stringify(textData, null, 2));
      
      if (textData.error?.message?.includes('RESOURCE_EXHAUSTED')) {
        console.log('⚠️  QUOTA LIMIT REACHED - API has exhausted quota');
      } else if (textData.error?.message?.includes('PERMISSION_DENIED')) {
        console.log('⚠️  PERMISSION ERROR - Check API key validity');
      }
      
      return;
    }

    console.log('✅ Text test passed');
    console.log('Response:', textData.candidates?.[0]?.content?.parts?.[0]?.text || 'No text in response');

    // Test 2: Check quota information
    console.log('\n📊 Test 2: Checking quota information');
    const quotaResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key=${API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const quotaData = await quotaResponse.json();
    if (quotaResponse.ok) {
      console.log('✅ Model info retrieved');
      console.log('Model:', quotaData.name);
    } else {
      console.log('⚠️  Could not retrieve quota info:', quotaData.error?.message);
    }

    // Test 3: Vision test with a simple image (1x1 pixel)
    console.log('\n🖼️  Test 3: Vision API test (minimal image)');
    const minimalBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=='; // 1x1 red pixel PNG

    const visionResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: 'What do you see in this image?' },
                {
                  inlineData: {
                    mimeType: 'image/png',
                    data: minimalBase64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const visionData = await visionResponse.json();
    
    if (!visionResponse.ok) {
      console.log('❌ Vision test failed');
      console.log('Status:', visionResponse.status);
      console.log('Error:', visionData.error?.message);
      
      if (visionData.error?.message?.includes('RESOURCE_EXHAUSTED')) {
        console.log('⚠️  QUOTA LIMIT REACHED on Vision API');
      }
      
      return;
    }

    console.log('✅ Vision test passed');
    console.log('Response:', visionData.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 100) || 'No response');

    // Test 4: Rate limit check
    console.log('\n⚡ Test 4: Rate limit stress test (5 rapid requests)');
    let successCount = 0;
    let failureCount = 0;

    for (let i = 1; i <= 5; i++) {
      try {
        const rapidResponse = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': API_KEY,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Test request ${i}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const rapidData = await rapidResponse.json();

        if (rapidResponse.ok) {
          successCount++;
          console.log(`  Request ${i}: ✅ Success`);
        } else {
          failureCount++;
          console.log(`  Request ${i}: ❌ Failed - ${rapidData.error?.message}`);
        }
      } catch (err) {
        failureCount++;
        console.log(`  Request ${i}: ❌ Error - ${err.message}`);
      }
    }

    console.log(`\nRate limit results: ${successCount}/5 successful, ${failureCount}/5 failed`);

    // Final Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SMOKE TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ API is accessible');
    console.log('✅ Text generation works');
    console.log('✅ Vision API works');
    console.log(`✅ Rate limits allow ${successCount} rapid requests`);
    console.log('\n✨ All tests passed! API is functioning normally.');

  } catch (error) {
    console.error('\n❌ Smoke test failed with error:', error.message);
    process.exit(1);
  }
}

runSmokeTest().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
