const { randomBytes } = require('crypto');
const db = require('../db');

class LocalStore {
  getID(length) {
    return randomBytes(length).toString('hex');
  }

  async get(sid, ctx) {
    const users = await db.get('users');
    const user = users.find(usr => usr.sid === sid);
    const session = user && { passport: { user: user.id } } || false;

    return session;
  }

  async set(session, { sid = this.getID(24), maxAge = 1000000 } = {}, ctx) {
    try {
      const users = await db.get('users');
      const user = users.find(item => session.passport && item.id === session.passport.user);
      user.sid = sid;
      await db.write('users', users, user);
    } catch (e) {
      console.log('Error set user sid', e);
    }

    return sid;
  }

  async destroy(sid) {
    try {
      const users = await db.get('users');
      const user = users.find(item => item.sid === sid);

      delete user.sid;
      await db.write('users', users, user);
    } catch (e) {
      console.log('Error remove sid user', e);
    }

    delete this.sessions[sid];
  }
}

module.exports = LocalStore;
