const { readdirSync, readFileSync, writeFile } = require('fs');
const fsxtra = require('fs-extra');
const path = require('path');
const { mergeWith } = require('lodash');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function customizer(objValue, srcValue) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }

  if (srcValue && typeof srcValue === 'object') {
    return mergeWith(objValue, srcValue, customizer);
  }

  return typeof srcValue !== 'undefined' ? srcValue : objValue;
}

function mergeDeep(...args) {
  // @ts-ignore
  return mergeWith.apply(null, [...args, customizer]);
}

function readThumb(templateName, moduleName, themeFolder) {
  try {
    const images = readdirSync(`./src/templates/${templateName}/images/${moduleName}`, {
      withFileTypes: true,
    });

    return images
      .filter((img) => img.name.startsWith('thumb'))
      .map((_, idx) => ({
        id: uuidv4(),
        thumbnail: `/${themeFolder}/${templateName}/images/${moduleName.toLowerCase()}/thumb_${
          idx + 1
        }.png`,
        image: `/${themeFolder}/${templateName}/images/${moduleName.toLowerCase()}/${idx + 1}.png`,
      }));
  } catch (e) {}
}

function readThemes(themeFolder) {
  const templates = readdirSync('./src/templates', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== 'images')
    .map((dirent) => dirent.name);

  const edmThemes = [];

  templates.forEach((templateName) => {
    const templatesJson = {
      id: uuidv4(),
      name: templateName,
      thumbnail: `/${themeFolder}/${templateName}/images/main_thumb.png`,
      modules: [],
    };

    const files = readdirSync(`./src/templates/Default`, {
      withFileTypes: true,
    }).filter((dirent) => dirent.isFile() && dirent.name.endsWith('.json'));

    files.forEach((dirent) => {
      const module = {};
      const moduleName = dirent.name.replace('.json', '');

      try {
        const hbs = readFileSync(`./src/templates/${templateName}/${moduleName}.hbs`);

        module.template = hbs.toString();
      } catch (e) {
        try {
          const hbs = readFileSync(`./src/templates/Default/${moduleName}.hbs`);

          module.template = hbs.toString();
        } catch (e) {}
      }

      let json = readFileSync(`./src/templates/Default/${moduleName}.json`);
      try {
        const themeJson = readFileSync(`./src/templates/${templateName}/${moduleName}.json`);
        json = mergeDeep({}, JSON.parse(json), JSON.parse(themeJson));
        json = JSON.stringify(json);
      } catch (err) {}

      module.type = moduleName;
      module.id = uuidv4();

      if (json.toString()) {
        const config = JSON.parse(json.toString().replace(/\n/g, ''));

        const imgs = readThumb(
          templateName,
          moduleName === 'image-text' ? 'text' : moduleName,
          themeFolder
        );

        config.defaultImages = imgs ? imgs : [];

        module.config = config;

        if (
          ['header', 'footer', 'text', 'image-text'].includes(moduleName) &&
          !config.textStyle.backgroundImage &&
          imgs?.length > 0
        ) {
          config.textStyle.backgroundImage = imgs[0].image;
        }
      }

      templatesJson.modules.push(module);
    });

    const { modules, ...edmTheme } = templatesJson;
    edmThemes.push(edmTheme);

    fsxtra.outputFile(
      `./src/${themeFolder}/${templateName}/data.json`,
      JSON.stringify(templatesJson, null, 2),

      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  });

  writeFile(`./src/${themeFolder}/edm-themes.json`, JSON.stringify(edmThemes, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('success');
  });
}

function copyFolder(source, dist) {
  // To copy a folder or file
  fsxtra.copySync(source, dist, { overwrite: true }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('success!');
    }
  });
}

function copyImages(themeFolder) {
  const folders = readdirSync('./src/templates', { withFileTypes: true }).filter((dirent) =>
    dirent.isDirectory()
  );

  folders.forEach((folder) => {
    try {
      copyFolder(
        `./src/templates/${folder.name}/images`,
        `./src/${themeFolder}/${folder.name}/images`
      );
    } catch (e) {}
  });
}

function start() {
  readThemes('themes');
  copyImages('themes');
}

start();
