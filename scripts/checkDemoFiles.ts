#!/usr/bin/env tsx

/**
 * Demo文件检查脚本
 * 使用方法: npx tsx scripts/checkDemoFiles.ts
 */

import path from 'path';
import { checkAllDemoPages } from '../src/utils/checkDemoFiles';

async function main() {
  try {
    console.log('🔍 开始检查demo文件...\n');

    const projectRoot = path.resolve(__dirname, '..');
    const reports = checkAllDemoPages(projectRoot);

    let totalMissing = 0;
    let totalFiles = 0;

    console.log('='.repeat(60));
    console.log('📊 检查结果汇总');
    console.log('='.repeat(60));

    Object.entries(reports).forEach(([fileName, report]) => {
      console.log(`\n📄 ${fileName}:`);
      console.log(`   总文件数: ${report.totalFiles}`);
      console.log(`   存在文件: ${report.existingFiles}`);
      console.log(`   缺失文件: ${report.missingFiles}`);

      totalFiles += report.totalFiles;
      totalMissing += report.missingFiles;

      if (report.missingFiles > 0) {
        console.log(`   ❌ 缺失文件:`);
        report.missingFilesList.forEach((filePath) => {
          const result = report.results.find((r) => r.filePath === filePath);
          console.log(`      - ${filePath} (第${result?.lineNumber}行)`);
        });
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('📈 总体统计');
    console.log('='.repeat(60));
    console.log(`总文件数: ${totalFiles}`);
    console.log(`缺失文件数: ${totalMissing}`);
    console.log(
      `完整性: ${totalFiles > 0 ? (((totalFiles - totalMissing) / totalFiles) * 100).toFixed(1) : 0}%`,
    );

    if (totalMissing > 0) {
      console.log('\n⚠️  发现缺失文件，请检查上述列表！');
      process.exit(1);
    } else {
      console.log('\n✅ 所有demo文件都存在！');
    }
  } catch (error) {
    console.error('❌ 检查过程中出错:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}
