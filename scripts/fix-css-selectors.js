const fs = require('fs');
const path = require('path');

const TARGET_DIR = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(__dirname, '../src');

const EXTENSIONS = ['.css'];
const IGNORED_DIRS = ['node_modules', '.next', 'dist', 'build', '.git'];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORED_DIRS.includes(file)) {
                processDirectory(fullPath);
            }
        } else if (EXTENSIONS.includes(path.extname(file))) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Regex to find ": space pseudo" pattern.
    // Common pseudos.
    const pseudos = [
        'hover', 'focus', 'active', 'visited', 'link',
        'disabled', 'enabled', 'checked', 'target', 'empty',
        'first-child', 'last-child', 'nth-child', 'nth-of-type',
        'nth-last-child', 'nth-last-of-type', 'first-of-type', 'last-of-type', 'only-child', 'only-of-type',
        'before', 'after', 'placeholder', 'selection',
        'root', 'not', 'is', 'where', 'has'
    ];

    const pseudoPattern = pseudos.join('|');
    // Look for: char before colon (word char), colon, whitespace, pseudo key, then delimiter like { or , or just space?
    // Selectors usually followed by { or , or space (nested).
    // The error was specifically "Invalid token in pseudo element: WhiteSpace".
    // So `.class: hover` is the bad pattern.

    // Fix: Handle optional leading colon for pseudo-elements like ::before becoming : :before
    // $1 matches the first colon, \s+ matches space, $2 matches optional colon + pseudo name
    const regex = new RegExp(`(:)\\s+((:)?(${pseudoPattern}))`, 'g');

    // Only replace if it looks like a selector? 
    // We can be aggressive because usually `prop: hover` space is fine (invalid prop anyway? or value).
    // But strictly removing space `prop:hover` is also valid CSS.
    // So removing the space globally for `: hover` -> `:hover` is safe.

    let newContent = content.replace(regex, ':$2');

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Repaired: ${filePath}`);
    }
}

console.log(`Starting CSS Selector repair...`);
console.log(`Target: ${TARGET_DIR}`);

processDirectory(TARGET_DIR);
console.log('Repair complete.');
