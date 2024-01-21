const fs = require('fs');
const path = require('path');

const styleArr = [];

async function writeStyles(readable) {
  for await (const chunk of readable) {
    styleArr.push(chunk);
  }
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );
  styleArr.forEach((style) => {
    writeStream.write(style);
  });
}

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    files.forEach((file) => {
      const ext = path.extname(file.name);
      if (ext === '.css') {
        const readStream = fs.createReadStream(
          path.join(__dirname, 'styles', file.name),
          'utf8',
        );
        writeStyles(readStream);
      }
    });
  },
);
