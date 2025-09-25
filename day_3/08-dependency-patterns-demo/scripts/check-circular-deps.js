#!/usr/bin/env node

const madge = require('madge');
const path = require('path');

async function checkCircularDependencies() {
  console.log('🔍 Checking for circular dependencies...\n');

  try {
    const res = await madge('./src', {
      fileExtensions: ['ts'],
      excludeRegExp: [
        '.*\\.spec\\.ts$',
        '.*\\.test\\.ts$'
      ],
    });

    // Check for circular dependencies
    const circular = res.circular();

    if (circular.length > 0) {
      console.log('❌ Circular dependencies found:');
      circular.forEach((circle, index) => {
        console.log(`\n${index + 1}. Circular dependency chain:`);
        console.log('   ' + circle.join(' → ') + ' → ' + circle[0]);
      });

      console.log('\n📊 Dependency Analysis:');
      console.log(`   Total files processed: ${res.obj().length}`);
      console.log(`   Circular dependencies: ${circular.length}`);

      console.log('\n💡 Solutions:');
      console.log('   1. Use forwardRef() in NestJS dependency injection');
      console.log('   2. Restructure modules to remove circular imports');
      console.log('   3. Apply dependency inversion principle');
      console.log('   4. Use events or message passing instead of direct dependencies');

      process.exit(1);
    } else {
      console.log('✅ No circular dependencies found!');
      console.log(`📊 Analyzed ${Object.keys(res.obj()).length} files`);
    }

    // Show dependency tree for main modules
    console.log('\n📈 Module Dependency Overview:');
    const deps = res.obj();
    Object.keys(deps).forEach(file => {
      if (file.includes('.module.ts') && !file.includes('spec')) {
        const moduleName = path.basename(file, '.ts');
        console.log(`   ${moduleName}: ${deps[file].length} dependencies`);
      }
    });

  } catch (error) {
    console.error('❌ Error analyzing dependencies:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  checkCircularDependencies();
}

module.exports = { checkCircularDependencies };