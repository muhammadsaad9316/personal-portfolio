const fs = require('fs');
const path = require('path');

// Configuration
// Configuration
const SCALE_FACTOR = 0.75;
// Allow passing target directory via CLI, default to ../src
const TARGET_DIR = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(__dirname, '../src');

const EXTENSIONS = ['.css'];
const IGNORED_DIRS = ['node_modules', '.next', 'dist', 'build', '.git'];

// Properties to IGNORE scaling (exact property names)
const IGNORED_PROPERTIES = new Set([
    'z-index',
    'opacity',
    'font-weight',
    'flex', // flex-grow, flex-shrink are usually unitless but good to be safe if `flex: 1`
    'flex-grow',
    'flex-shrink',
    'order',
    'line-height', // often unitless
    'aspect-ratio' // usually ratio
]);

// Values/Functions to IGNORE (substring match or exact match logic to be handled)
// We mostly care about not scaling things inside transform like rotate(90deg) or scale(1.1) if they happened to match our number regex.
// However, our number regex usually looks for units.
// The requirement says: Do NOT scale transform, scale(), rotate()
// The requirements also say: Only scale values with these units: px, rem, em
// So if we ONLY look for px, rem, em, we automatically avoid degree, unitless numbers (z-index, opacity, flex), % etc.

// BUT, transform can have execute translate(100px). using `transform` in the ignored properties list is safer.
const IGNORED_PROPERTIES_FOR_SCALING = new Set([
    'transform',
    'webket-transform',
    'moz-transform',
]);

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
    let newContent = content;

    // Regex to find CSS declarations: property: value;
    // This is a simple regex and might not catch everything perfectly (e.g. nested blocks, comments)
    // but for a migration script it's usually sufficient if the CSS is standard.
    // We will process line by line or use a global regex.
    // Global regex for "property: value" is tricky with multiline.
    // Let's try to identify numbers with units.

    // Strategy:
    // 1. Split content by lines (mostly for safer processing of comments/scope).
    //    Actually, regex replace on the whole file or per declaration is better?
    //    "multiply every numeric CSS value by 0.75"
    //    "Only scale values with these units: px, rem, em"

    // Let's just Regex replace numbers with those units, BUT checks context to ensure we aren't in `transform` or `ignored property`.
    // Checking context with Regex is hard.

    // Better Strategy:
    // Iterate over all matches of `property: value;` or `property: value` (in style attr?)
    // Since we are processing .css files, we can assume standard syntax.

    // Regex to capture property and value
    // ([a-zA-Z-]+)\s*:\s*([^;]+)(;|})?
    // match[1] = property
    // match[2] = value

    // Fix: Exclude { from value capture to avoid matching selectors like .class:hover {
    const cssDeclarationRegex = /([a-zA-Z-][a-zA-Z0-9-]*)\s*:\s*([^;}{^]+)(?=[;}])/g;
    // detecting closing brace or semicolon is important.
    // However, sometimes values span multiple lines (though less common in simple CSS).

    // Let's process the entire file content, identifying "property: values".
    // Note: this regex might fail on complex nested structures or comments if not careful,
    // but for standard CSS files it works reasonably well.

    let fileModified = false;

    newContent = newContent.replace(cssDeclarationRegex, (match, property, value) => {
        const propName = property.trim().toLowerCase();

        // Check if property is ignored
        if (IGNORED_PROPERTIES.has(propName) || IGNORED_PROPERTIES_FOR_SCALING.has(propName)) {
            return match; // Return unchanged
        }

        // Now look for numbers with units in the value
        // Requirement: Only px, rem, em
        // Regex for values: (\d*\.?\d+)(px|rem|em)
        const valueUnitRegex = /(\d*\.?\d+)(px|rem|em)/gi;

        let valueModified = false;
        const newValue = value.replace(valueUnitRegex, (m, numberStr, unit) => {
            // Double check it's not inside a url() or content: "" (though unlikely to have px there)

            const num = parseFloat(numberStr);
            if (isNaN(num)) return m;

            // requirement: Round to max 4 decimal places
            const scaled = num * SCALE_FACTOR;
            const rounded = Math.round(scaled * 10000) / 10000;

            // Avoid replacing 0px with 0px if no actual change (optimization)
            if (num === 0) return m;

            valueModified = true;
            return `${rounded}${unit}`;
        });

        if (valueModified && newValue !== value) {
            fileModified = true;
            return `${property}: ${newValue}`;
        }

        return match;
    });

    if (fileModified) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

console.log(`Starting CSS scale migration...`);
console.log(`Target Dir: ${TARGET_DIR}`);
console.log(`Scale Factor: ${SCALE_FACTOR}`);

try {
    if (fs.existsSync(TARGET_DIR)) {
        processDirectory(TARGET_DIR);
        console.log('Migration complete.');
    } else {
        console.error(`Directory not found: ${TARGET_DIR}`);
    }
} catch (error) {
    console.error('Error during migration:', error);
}
