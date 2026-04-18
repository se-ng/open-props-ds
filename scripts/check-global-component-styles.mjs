import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const LIB_ROOT = join(process.cwd(), 'projects/ng-open-ui/src/lib');

const tsFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.name.endsWith('.ts') || entry.name.endsWith('.spec.ts')) {
      continue;
    }

    tsFiles.push(fullPath);
  }
}

walk(LIB_ROOT);

const violations = [];

for (const filePath of tsFiles) {
  const source = readFileSync(filePath, 'utf8');

  const hasComponentDecorator = /@Component\s*\(/m.test(source);
  if (!hasComponentDecorator) {
    continue;
  }

  const hasStyleUrl = /\bstyleUrl\s*:/m.test(source);
  const hasStyleUrls = /\bstyleUrls\s*:/m.test(source);
  const hasInlineStyles = /\bstyles\s*:/m.test(source);

  if (hasStyleUrl || hasStyleUrls || hasInlineStyles) {
    const violationsInFile = [];
    if (hasStyleUrl) violationsInFile.push('styleUrl');
    if (hasStyleUrls) violationsInFile.push('styleUrls');
    if (hasInlineStyles) violationsInFile.push('styles');

    violations.push({ filePath, fields: violationsInFile });
  }
}

if (violations.length > 0) {
  console.error('Global component style policy violation(s) found:\n');
  for (const violation of violations) {
    console.error(`- ${violation.filePath}`);
    console.error(`  Disallowed decorator field(s): ${violation.fields.join(', ')}`);
  }
  console.error('\nUse src/styles/components.css for component style imports.');
  process.exit(1);
}

console.log(`Global component style policy check passed (${tsFiles.length} file(s) scanned).`);
