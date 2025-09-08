// Script to set up Edge Config with initial data
// Run this with: node scripts/setup-edge-config.js

const { EdgeConfig } = require('@vercel/edge-config');

async function setupEdgeConfig() {
  try {
    const edgeConfigId = 'ecfg_rfb73qburo1alpsfoxu89vhqhiqp';
    const edgeConfig = new EdgeConfig(edgeConfigId);
    
    // Initialize with empty array for webinar registrations
    await edgeConfig.set('webinar_registrations', []);
    
    console.log('✅ Edge Config initialized successfully!');
    console.log('📊 Initial data: webinar_registrations = []');
    console.log('🔗 Edge Config ID:', edgeConfigId);
    
  } catch (error) {
    console.error('❌ Error setting up Edge Config:', error);
    console.log('\n📝 Manual setup instructions:');
    console.log('1. Go to Vercel Dashboard > Edge Config');
    console.log('2. Select your Edge Config instance: ecfg_rfb73qburo1alpsfoxu89vhqhiqp');
    console.log('3. Add a new key: "webinar_registrations"');
    console.log('4. Set value to: []');
    console.log('5. Add environment variable EDGE_CONFIG=ecfg_rfb73qburo1alpsfoxu89vhqhiqp');
  }
}

setupEdgeConfig();
