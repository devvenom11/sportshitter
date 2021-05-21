const fs = require('fs');
const filepath = './www/index.html';

const versionNumber = Date.now();

const filesToUpdate = [
    'main.js',
    'vendor.js',
    'main.css',
    'polyfills.js',
    'manifest.json'
]


const addVersionQueryWithFileName = () => {
    console.log('Start updating version...');
    console.log(`VERSION=${versionNumber}`);
    const index_orig = fs.readFileSync(filepath, 'utf8');
    let index_new = index_orig;
    filesToUpdate.forEach(filename => {
        index_new = index_new.replace(filename, `${filename}?version=${versionNumber}`)
    })
    fs.writeFileSync(filepath, index_new, 'utf8');
    console.log('Version updated successfully...');
}

addVersionQueryWithFileName();