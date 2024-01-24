const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
rl.write('write your text\n');
rl.on('line', (text) => {
  if (text === 'exit') return rl.close();
  writeStream.write(text + '\n');
});
rl.on('close', () => {
  output.write('\nprogram is ended');
});
