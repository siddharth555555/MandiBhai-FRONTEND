const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.startsWith("'use client';") && !content.startsWith('"use client";')) {
                fs.writeFileSync(fullPath, "'use client';\n" + content);
            }
        }
    }
}

const dirs = ['src/components', 'src/admin', 'src/context', 'src/services', 'src/utils', 'src/lib'];
for (const dir of dirs) {
    if (fs.existsSync(dir)) {
        processDir(dir);
    }
}
console.log('Successfully prepended use client.');
