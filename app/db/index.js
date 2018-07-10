const path = require('path');
const fs = require('jsonfile');
const initDefaultUser = require('./initDefaultUser');

initDefaultUser();

module.exports = {
  get(fileName) {
    return new Promise((res, rej) => {
      fs.readFile(path.resolve(__dirname, `${fileName}.json`), (err, data) => {
        if (err) {
          console.log(err);
          rej(err);
        }

        res(data);
      });
    });
  },

  write(fileName, data, addInfo) {
    return new Promise((res, rej) => {
      if (!addInfo) {
        rej('Empty data');
      }

      fs.writeFile(path.resolve(__dirname, `${fileName}.json`), data, (err) => {
        if (err) {
          console.log(err);
          rej(err);
        }

        res(addInfo || data);
      });
    });
  }
};
