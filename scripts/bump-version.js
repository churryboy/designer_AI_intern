#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read current version from a version file
const versionFilePath = path.join(__dirname, '..', 'version.json');
let currentVersion = { major: 1, minor: 0, patch: 1 };

if (fs.existsSync(versionFilePath)) {
  currentVersion = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
}

// Increment patch version
currentVersion.patch += 1;

// Format version string
const versionString = `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`;

// Update version.json
fs.writeFileSync(versionFilePath, JSON.stringify(currentVersion, null, 2));

// Update client version
const clientPath = path.join(__dirname, '..', 'client', 'src', 'pages', 'dashboard.tsx');
let clientContent = fs.readFileSync(clientPath, 'utf8');
clientContent = clientContent.replace(
  /const CLIENT_VERSION = '[0-9]+\.[0-9]+\.[0-9]+'/,
  `const CLIENT_VERSION = '${versionString}'`
);
fs.writeFileSync(clientPath, clientContent);

// Update server version
const serverPath = path.join(__dirname, '..', 'server', 'src', 'index.ts');
let serverContent = fs.readFileSync(serverPath, 'utf8');
serverContent = serverContent.replace(
  /const SERVER_VERSION = '[0-9]+\.[0-9]+\.[0-9]+'/,
  `const SERVER_VERSION = '${versionString}'`
);
fs.writeFileSync(serverPath, serverContent);

console.log(`✅ Version bumped to ${versionString}`);
console.log('📝 Updated files:');
console.log('   - version.json');
console.log('   - client/src/pages/dashboard.tsx');
console.log('   - server/src/index.ts');
