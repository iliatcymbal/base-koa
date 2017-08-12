const path = require('path');
const fs = require('jsonfile');

module.exports = {
  get(name) {
    return require(`./${name}.json`);
  },

  write(fileName, data, addInfo) {
    return new Promise((res, rej) => {
      fs.writeFile(path.resolve(__dirname, `${fileName}.json`), data, (err) => {
        if (err) {
          console.log(err);
          rej(err);
        }

        res(addInfo || data);
      });
    });
  },
};
