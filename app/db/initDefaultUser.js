const path = require('path');
const fs = require('fs');
const os = require('os');

const defaultUserPath = path.resolve(__dirname, 'defaultUser.json');
const defaultUser = require(defaultUserPath);
const usersPath = path.resolve(__dirname, 'users.json');

const createDefaultUser = () => {
  const { username } = os.userInfo();
  defaultUser.lastName = username;
  const users = JSON.stringify([defaultUser]);

  fs.writeFile(usersPath, users, (err) => {
    if (err) throw err;
  });
};

module.exports = () => {
  if (defaultUser && os.userInfo) {
    fs.stat(usersPath, (err) => {
      if (err && err.code === 'ENOENT') {
        createDefaultUser();
        return;
      }

      if (err) throw err;
    });
  }
};
