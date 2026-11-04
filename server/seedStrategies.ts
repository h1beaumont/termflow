// Standalone script to seed conversation strategies
import { storage } from "./storage";
import { STRATEGY_DEFINITIONS } from "./conversationStrategies";

async function seedStrategies() {
  try {
    console.log('🌱 Seeding conversation strategies...');
    
    // Check if strategies already exist
    const existing = await storage.getAllStrategies();
    
    if (existing.length > 0) {
      console.log(`✅ Strategies already seeded (${existing.length} strategies found)`);
      existing.forEach(s => {
        console.log(`   - ${s.strategyType}: ${s.name}`);
      });
      return;
    }
    
    // Insert all strategy definitions
    const seededStrategies = [];
    for (const strategyDef of STRATEGY_DEFINITIONS) {
      const strategy = await storage.createStrategy(strategyDef);
      seededStrategies.push(strategy);
      console.log(`   ✓ Seeded: ${strategy.strategyType} - ${strategy.name}`);
    }
    
    console.log(`\n✅ Successfully seeded ${seededStrategies.length} conversation strategies!`);
    console.log('\nStrategies created:');
    seededStrategies.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name} (${s.strategyType})`);
      console.log(`   Priority: ${s.priority}, Active: ${s.isActive}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedStrategies();
