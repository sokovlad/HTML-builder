const fs = require('fs');
const path = require('path');
async function logChunks(readable) {
  for await (const chunk of readable) {
    console.log(chunk);
  }
}
const readStream = fs.createReadStream(
  path.join('01-read-file', 'text.txt'),
  'utf8',
);
logChunks(readStream);
