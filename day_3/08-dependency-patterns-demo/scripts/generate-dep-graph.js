#!/usr/bin/env node

const madge = require('madge');
const fs = require('fs');
const path = require('path');

async function generateDependencyGraph() {
  console.log('📊 Generating dependency graph...\n');

  try {
    const res = await madge('./src', {
      fileExtensions: ['ts'],
      excludeRegExp: [
        '.*\\.spec\\.ts$',
        '.*\\.test\\.ts$'
      ],
    });

    // Generate DOT format for visualization
    const dotOutput = res.dot();

    // Save DOT file
    fs.writeFileSync('./dependency-graph.dot', dotOutput);
    console.log('✅ DOT file generated: dependency-graph.dot');
    console.log('   Convert to image: dot -Tpng dependency-graph.dot -o dependency-graph.png');

    // Generate simple text-based dependency report
    const deps = res.obj();
    let report = 'DEPENDENCY ANALYSIS REPORT\n';
    report += '========================\n\n';

    // Analyze by file types
    const modules = {};
    const services = {};
    const controllers = {};
    const others = {};

    Object.keys(deps).forEach(file => {
      const fileName = path.basename(file);
      const relativePath = path.relative('./src', file);

      if (fileName.endsWith('.module.ts')) {
        modules[relativePath] = deps[file];
      } else if (fileName.endsWith('.service.ts')) {
        services[relativePath] = deps[file];
      } else if (fileName.endsWith('.controller.ts')) {
        controllers[relativePath] = deps[file];
      } else {
        others[relativePath] = deps[file];
      }
    });

    // Modules section
    report += 'MODULES:\n';
    report += '--------\n';
    Object.entries(modules).forEach(([module, deps]) => {
      report += `${module}:\n`;
      deps.forEach(dep => {
        const relativeDep = path.relative('./src', dep);
        report += `  → ${relativeDep}\n`;
      });
      report += '\n';
    });

    // Services section
    report += 'SERVICES:\n';
    report += '---------\n';
    Object.entries(services).forEach(([service, deps]) => {
      report += `${service}:\n`;
      deps.forEach(dep => {
        const relativeDep = path.relative('./src', dep);
        report += `  → ${relativeDep}\n`;
      });
      report += '\n';
    });

    // Controllers section
    report += 'CONTROLLERS:\n';
    report += '------------\n';
    Object.entries(controllers).forEach(([controller, deps]) => {
      report += `${controller}:\n`;
      deps.forEach(dep => {
        const relativeDep = path.relative('./src', dep);
        report += `  → ${relativeDep}\n`;
      });
      report += '\n';
    });

    // Summary
    report += 'SUMMARY:\n';
    report += '--------\n';
    report += `Total Modules: ${Object.keys(modules).length}\n`;
    report += `Total Services: ${Object.keys(services).length}\n`;
    report += `Total Controllers: ${Object.keys(controllers).length}\n`;
    report += `Other Files: ${Object.keys(others).length}\n`;
    report += `Total Dependencies: ${Object.values(deps).flat().length}\n`;

    // Check for potential issues
    const highDependencyFiles = Object.entries(deps).filter(([file, fileDeps]) => fileDeps.length > 5);
    if (highDependencyFiles.length > 0) {
      report += '\nHIGH DEPENDENCY FILES (>5 dependencies):\n';
      report += '----------------------------------------\n';
      highDependencyFiles.forEach(([file, fileDeps]) => {
        const relativePath = path.relative('./src', file);
        report += `${relativePath}: ${fileDeps.length} dependencies\n`;
      });
    }

    fs.writeFileSync('./dependency-report.txt', report);
    console.log('✅ Dependency report generated: dependency-report.txt');

    // Check for circular dependencies
    const circular = res.circular();
    if (circular.length > 0) {
      console.log('\n❌ Found circular dependencies:');
      circular.forEach((circle, index) => {
        console.log(`${index + 1}. ${circle.join(' → ')}`);
      });
    } else {
      console.log('\n✅ No circular dependencies found');
    }

  } catch (error) {
    console.error('❌ Error generating dependency graph:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  generateDependencyGraph();
}

module.exports = { generateDependencyGraph };