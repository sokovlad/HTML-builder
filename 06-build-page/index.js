const fs = require('fs');
const path = require('path');

const styleArr = [];

async function writeStyles(readable) {
  for await (const chunk of readable) {
    styleArr.push(chunk);
  }
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
  );
  styleArr.forEach((style) => {
    writeStream.write(style);
  });
}

async function mergeStyle() {
  await fs.readdir(
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
}

async function createDir() {
  await fs.mkdir(
    path.join(__dirname, 'project-dist'),
    { recursive: true },
    (err) => {
      if (err) console.log(err);
    },
  );
}

async function copyDir() {
  await fs.mkdir(
    path.join(__dirname, 'project-dist', 'assets'),
    { recursive: true },
    (err) => {
      if (err) console.log(err);
    },
  );
  await fs.readdir(path.join(__dirname, 'assets'), async (err, files) => {
    if (err) console.log(err);
    await files.forEach((file) => {
      fs.stat(path.join(__dirname, 'assets', file), async (err, item) => {
        if (err) console.log(err);
        if (item.isDirectory()) {
          fs.readdir(path.join(__dirname, 'assets', file), (err, data) => {
            if (err) console.log(err);
            data.forEach((dataIn) => {
              fs.mkdir(
                path.join(__dirname, 'project-dist', 'assets', file),
                { recursive: true },
                (err) => {
                  if (err) console.log(err);
                  fs.copyFile(
                    path.join(__dirname, 'assets', file, dataIn),
                    path.join(
                      __dirname,
                      'project-dist',
                      'assets',
                      file,
                      dataIn,
                    ),
                    (err) => {
                      if (err) console.log(err);
                    },
                  );
                },
              );
            });
          });
        } else {
          fs.copyFile(
            path.join(__dirname, 'assets', file),
            path.join(__dirname, 'project-dist', 'assets', file),
            (err) => {
              if (err) console.log(err);
            },
          );
        }
      });
    });
    console.log('files have been copied successfully');
  });
}

async function createIndexPage() {
  await fs.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true },
    (err, components) => {
      fs.readFile(
        path.join(__dirname, 'template.html'),
        'utf8',
        (err, template) => {
          components.forEach((component) => {
            if (component.isFile()) {
              const ext = path.extname(component.name);
              const name = path.basename(component.name, ext);
              fs.readFile(
                path.join(__dirname, 'components', component.name),
                (err, data) => {
                  template = template.replace(`{{${name}}}`, data);
                  fs.writeFile(
                    path.join(__dirname, 'project-dist', 'index.html'),
                    template,
                    (err) => {
                      if (err) console.log(err);
                    },
                  );
                },
              );
            }
          });
        },
      );
    },
  );
}

async function build() {
  await createDir();
  await copyDir();
  await createIndexPage();
  await mergeStyle();
}

build();
