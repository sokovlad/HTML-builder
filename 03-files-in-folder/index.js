const fs = require('fs');
const path = require('path');
fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const ext = path.extname(file.name);
        const name = path.basename(file.name, ext);
        fs.lstat(path.join(file.path, file.name), (err, elem) => {
          const size = elem.size / 1024;
          console.log(
            name + ' -',
            ext.split('.').join('') + ' -',
            size.toFixed(3) + 'kB',
          );
        });
      }
    });
  },
);
